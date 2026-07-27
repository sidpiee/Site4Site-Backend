import { APIResponse } from "../utils/api-response.js";
import { APIError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import NodeCache from "node-cache";
import { Anime } from "../models/anime.model.js";

const myCache = new NodeCache({ stdTTL: 86400, checkperiod: 600 });

const findanime = asyncHandler(async (req, res) => {
  const searchTerm = req.query.anime?.trim();

  if (!searchTerm) {
    throw new APIError(400, "Anime name is required!");
  }

  const cacheKey = `anime-search:${searchTerm.toLowerCase()}`;
  const cachedData = myCache.get(cacheKey);

  if (cachedData) {
    return res
      .status(200)
      .json(new APIResponse(200, cachedData, "Fetched from cache"));
  }

  const url = new URL("https://kitsu.io/api/edge/anime");
  url.searchParams.set("filter[text]", searchTerm);
  url.searchParams.set("page[limit]", "8");

  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.api+json",
    },
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new APIError(
      502,
      "Anime service temporarily unavailable. Please try again.",
    );
  }

  const data = await response.json();

  if (!Array.isArray(data.data) || data.data.length === 0) {
    throw new APIError(404, "No anime found");
  }

  const animeList = data.data.map((item) => {
    const attributes = item.attributes;

    return {
      // This is a Kitsu anime ID, despite the legacy property name.
      mal_id: Number(item.id),
      title: attributes.canonicalTitle,
      title_english:
        attributes.titles?.en ??
        attributes.titles?.en_jp ??
        attributes.canonicalTitle,
      images: {
        jpg: {
          large_image_url:
            attributes.posterImage?.large ??
            attributes.posterImage?.original ??
            attributes.posterImage?.medium ??
            null,
        },
      },
      genres: [],
      episodes: attributes.episodeCount ?? 0,
    };
  });

  myCache.set(cacheKey, animeList);
  return res
    .status(200)
    .json(new APIResponse(200, animeList, "Anime fetched successfully"));
});

const getAnimeGenres = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !Number.isFinite(Number(id))) {
    throw new APIError(400, "Valid anime ID is required");
  }

  const cacheKey = `anime-genres:${id}`;
  const cachedGenres = myCache.get(cacheKey);

  if (cachedGenres) {
    return res
      .status(200)
      .json(new APIResponse(200, cachedGenres, "Fetched from cache"));
  }

  const response = await fetch(
    `https://kitsu.io/api/edge/anime/${encodeURIComponent(id)}/genres`,
    {
      headers: {
        Accept: "application/vnd.api+json",
      },
      signal: AbortSignal.timeout(10000),
    },
  );

  if (!response.ok) {
    throw new APIError(
      502,
      "Anime service temporarily unavailable. Please try again.",
    );
  }

  const data = await response.json();
  const genres = (data.data ?? []).map((genre) => ({
    mal_id: Number(genre.id),
    name: genre.attributes.name,
  }));

  myCache.set(cacheKey, genres);
  return res
    .status(200)
    .json(new APIResponse(200, genres, "Genres fetched successfully"));
});

const addAnime = asyncHandler(async (req, res) => {
  const anime = await Anime.create({
    ...req.body,
    userId: req.user.id,
    image: req.body.images.jpg.large_image_url,
  });

  res
    .status(201)
    .json(new APIResponse(201, anime, "Anime saved successfully"));
});

const getAnime = asyncHandler(async (req, res) => {
  const data = await Anime.aggregate([
    {
      $match: {
        userId: req.user.id,
      },
    },
    {
      $sort: {
        updatedAt: -1,
      },
    },
  ]);

  res
    .status(200)
    .json(new APIResponse(200, data, "User anime fetched successfully"));
});

const updateAnime = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, episodesWatched, notes, rating } = req.body;
  const anime = await Anime.findOneAndUpdate(
    {
      userId: req.user.id,
      mal_id: Number(id),
    },
    {
      status,
      episodesWatched,
      notes,
      rating,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!anime) {
    throw new APIError(404, "Anime not found");
  }

  res
    .status(200)
    .json(new APIResponse(200, anime, "Anime updated successfully"));
});

const deleteAnime = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const anime = await Anime.findOneAndDelete({
    userId: req.user.id,
    mal_id: id,
  });

  if (!anime) {
    throw new APIError(404, "Anime not found");
  }

  res
    .status(200)
    .json(new APIResponse(200, anime, "Anime deleted successfully"));
});

export {
  findanime,
  addAnime,
  getAnime,
  updateAnime,
  deleteAnime,
  getAnimeGenres,
};
