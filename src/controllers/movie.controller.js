import { APIResponse } from "../utils/api-response.js";
import { APIError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { fetchJson } from "../utils/fetch-json.js";
import NodeCache from "node-cache";
import { Movie } from "../models/movie.model.js";

const myCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

const fetchOmdb = (parameter, value) => {
  const url = new URL("https://www.omdbapi.com/");
  url.searchParams.set("apikey", process.env.OMDB_API_KEY);
  url.searchParams.set(parameter, value);

  return fetchJson(url, {
    serviceName: "Movie service",
    timeoutMs: 10000,
    headers: {
      Accept: "application/json",
    },
  });
};

const findmovie = asyncHandler(async (req, res) => {
  const { movie } = req.query;
  if (!movie?.trim()) {
    throw new APIError(400, "Movie name is required!");
  }

  const normalizedMovie = movie.trim().toLowerCase();
  const cacheKey = `movie-search:${normalizedMovie}`;
  const cachedData = myCache.get(cacheKey);

  if (cachedData) {
    return res
      .status(200)
      .json(new APIResponse(200, cachedData, "Fetched from cache"));
  }

  const data = await fetchOmdb("s", movie);

  if (data.Response === "False") {
    throw new APIError(404, data.Error || "No movie found");
  }

  myCache.set(cacheKey, data);
  res
    .status(200)
    .json(new APIResponse(200, data, "Movie fetched successfully"));
});

const findParticularMovie = asyncHandler(async (req, res) => {
  const { movie } = req.query;
  if (!movie?.trim()) {
    throw new APIError(400, "Movie ID is required!");
  }

  const normalizedMovie = movie.trim().toLowerCase();
  const cacheKey = `movie-details:${normalizedMovie}`;
  const cachedData = myCache.get(cacheKey);

  if (cachedData) {
    return res
      .status(200)
      .json(new APIResponse(200, cachedData, "Fetched from cache"));
  }

  const data = await fetchOmdb("i", movie);

  if (data.Response === "False") {
    throw new APIError(404, data.Error || "No movie found");
  }

  myCache.set(cacheKey, data);
  res
    .status(200)
    .json(new APIResponse(200, data, "Movie fetched successfully"));
});

const addMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.create({
    ...req.body,
    userId: req.user.id,
  });

  res
    .status(201)
    .json(new APIResponse(201, movie, "Movie added successfully"));
});

const getMovie = asyncHandler(async (req, res) => {
  const data = await Movie.aggregate([
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
    .json(new APIResponse(200, data, "User movies fetched successfully"));
});

const editMovie = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !id) {
    throw new APIError(400, "Status and ID are required");
  }

  const movie = await Movie.findOneAndUpdate(
    {
      imdbID: id,
      userId: req.user.id,
    },
    {
      status,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!movie) {
    throw new APIError(404, "Movie not found");
  }

  return res
    .status(200)
    .json(new APIResponse(200, movie, "Movie updated successfully"));
});

const updateMovie = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;
  const movie = await Movie.findOneAndUpdate(
    {
      userId: req.user.id,
      imdbID: id,
    },
    {
      status,
      notes,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!movie) {
    throw new APIError(404, "Movie not found");
  }

  return res
    .status(200)
    .json(new APIResponse(200, movie, "Movie updated successfully"));
});

const deleteMovie = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const movie = await Movie.findOneAndDelete({
    userId: req.user.id,
    imdbID: id,
  });

  if (!movie) {
    throw new APIError(404, "Movie not found");
  }

  return res
    .status(200)
    .json(new APIResponse(200, movie, "Movie deleted successfully"));
});

export {
  findmovie,
  findParticularMovie,
  addMovie,
  getMovie,
  editMovie,
  updateMovie,
  deleteMovie,
};
