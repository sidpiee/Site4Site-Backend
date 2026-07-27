import { APIResponse } from "../utils/api-response.js";
import { APIError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { fetchJson } from "../utils/fetch-json.js";
import NodeCache from "node-cache";
import { Game } from "../models/game.model.js";

const myCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

const fetchRawg = (path, params = {}) => {
  const url = new URL(`https://api.rawg.io/api/${path}`);
  url.searchParams.set("key", process.env.RAWG_API_KEY);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return fetchJson(url, {
    serviceName: "Game service",
    timeoutMs: 10000,
  });
};

const findgame = asyncHandler(async (req, res) => {
  const { game } = req.query;
  if (!game?.trim()) {
    throw new APIError(400, "Game name is required!");
  }

  const normalizedGame = game.trim().toLowerCase();
  const cacheKey = `game-search:${normalizedGame}`;
  const cachedData = myCache.get(cacheKey);

  if (cachedData) {
    return res
      .status(200)
      .json(new APIResponse(200, cachedData, "Fetched from cache"));
  }

  const data = await fetchRawg("games", {
    search: game,
    page_size: "8",
  });

  if (!data?.results?.length) {
    throw new APIError(404, "No game found");
  }

  myCache.set(cacheKey, data);
  res
    .status(200)
    .json(new APIResponse(200, data, "Game fetched successfully"));
});

const findParticulargame = asyncHandler(async (req, res) => {
  const { id } = req.query;
  if (!id) {
    throw new APIError(400, "Game ID is required!");
  }

  const cacheKey = `game-details:${id}`;
  const cachedData = myCache.get(cacheKey);

  if (cachedData) {
    return res
      .status(200)
      .json(new APIResponse(200, cachedData, "Fetched from cache"));
  }

  const data = await fetchRawg(`games/${encodeURIComponent(id)}`);

  if (!data?.id) {
    throw new APIError(404, "No game found");
  }

  myCache.set(cacheKey, data);
  res
    .status(200)
    .json(new APIResponse(200, data, "Game fetched successfully"));
});

const findScreenshots = asyncHandler(async (req, res) => {
  const { id } = req.query;
  if (!id) {
    throw new APIError(400, "Game ID is required!");
  }

  const cacheKey = `game-screenshots:${id}`;
  const cachedData = myCache.get(cacheKey);

  if (cachedData) {
    return res
      .status(200)
      .json(new APIResponse(200, cachedData, "Fetched from cache"));
  }

  const data = await fetchRawg(
    `games/${encodeURIComponent(id)}/screenshots`,
  );

  if (!data?.results?.length) {
    throw new APIError(404, "No screenshot found");
  }

  myCache.set(cacheKey, data, 86400);
  res
    .status(200)
    .json(new APIResponse(200, data, "Screenshots fetched successfully"));
});

const findTrailer = asyncHandler(async (req, res) => {
  const { id } = req.query;
  if (!id) {
    throw new APIError(400, "Game ID is required!");
  }

  const cacheKey = `game-trailer:${id}`;
  const cachedData = myCache.get(cacheKey);

  if (cachedData) {
    return res
      .status(200)
      .json(new APIResponse(200, cachedData, "Fetched from cache"));
  }

  const data = await fetchRawg(`games/${encodeURIComponent(id)}/movies`);

  if (!data?.results?.length) {
    throw new APIError(404, "No trailer found");
  }

  myCache.set(cacheKey, data, 86400);
  res
    .status(200)
    .json(new APIResponse(200, data, "Trailer fetched successfully"));
});

const addGame = asyncHandler(async (req, res) => {
  const game = await Game.create({
    ...req.body,
    userId: req.user.id,
  });

  res
    .status(201)
    .json(new APIResponse(201, game, "Game added successfully"));
});

const getGame = asyncHandler(async (req, res) => {
  const data = await Game.aggregate([
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
    .json(new APIResponse(200, data, "User games fetched successfully"));
});

const updateGame = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, note, personalRating, favourite } = req.body;
  const game = await Game.findOneAndUpdate(
    {
      userId: req.user.id,
      id,
    },
    {
      status,
      review: note,
      personalRating,
      favourite,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!game) {
    throw new APIError(404, "Game not found");
  }

  res
    .status(200)
    .json(new APIResponse(200, game, "Game updated successfully"));
});

const deleteGame = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const game = await Game.findOneAndDelete({
    id,
    userId: req.user.id,
  });

  if (!game) {
    throw new APIError(404, "Game not found");
  }

  res
    .status(200)
    .json(new APIResponse(200, game, "Game deleted successfully"));
});

export {
  findgame,
  findParticulargame,
  findScreenshots,
  findTrailer,
  addGame,
  getGame,
  updateGame,
  deleteGame,
};
