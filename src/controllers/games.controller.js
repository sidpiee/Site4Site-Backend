import { APIResponse } from "../utils/api-response.js";
import { APIError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import NodeCache from "node-cache";
import { Game } from "../models/game.model.js";

const myCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });
const findgame = asyncHandler(async (req, res) => {
  const { game } = req.query;
  if (!game?.trim()) {
    throw new APIError(400, "game name is required!");
  }

  const normalizedgame = game.trim().toLowerCase();

  const cachedData = myCache.get(normalizedgame);
  if (cachedData) {
    return res
      .status(200)
      .json(new APIResponse(200, cachedData, "Fetched from cache"));
  }
 const result = await fetch(
  `https://api.rawg.io/api/games?key=${process.env.RAWG_API_KEY}&search=${encodeURIComponent(game)}&page_size=8`
);
  if (!result.ok) {
    const text = await result.text();
    console.log("game API error:", result.status, text);
    throw new APIError(
      result.status,
      "game service temporarily unavailable. Please try again.",
    );
  }
  const data = await result.json();
  if (!data || data.results?.length === 0)
    throw new APIError(404, data.Error || "No game found");
  myCache.set(normalizedgame, data);
  res
    .status(200)
    .json(new APIResponse(200, data, "game fetched successfully"));
});

const findParticulargame = asyncHandler(async (req, res) => {
  const { id } = req.query;
  if (!id) {
    throw new APIError(400, "game id is required!");
  }

  const cacheKey = `game-${id}`;
  const cachedData = myCache.get(cacheKey);
  if (cachedData) {
    return res
      .status(200)
      .json(new APIResponse(200, cachedData, "Fetched from cache"));
  }
  const result = await fetch(
    `https://api.rawg.io/api/games/${encodeURIComponent(id)}?key=${process.env.RAWG_API_KEY}` ,
    {
      
    },
  );
  if (!result.ok) {
    const text = await result.text();
    console.log("game API error:", result.status, text);
    throw new APIError(
      result.status,
      "game service temporarily unavailable. Please try again.",
    );
  }
  const data = await result.json();
  if (!data?.id)
    throw new APIError(404, data.Error || "No game found");
  myCache.set(cacheKey, data);
  res
    .status(200)
    .json(new APIResponse(200, data, "game fetched successfully"));
});


const findScreenshots = asyncHandler(async (req, res) => {
  const { id } = req.query;
  if (!id) {
    throw new APIError(400, "game id is required!");
  }

  const cacheKey = `screenshots-${id}`;
  const cachedData = myCache.get(cacheKey);
  if (cachedData) {
    return res
      .status(200)
      .json(new APIResponse(200, cachedData, "Fetched from cache"));
  }
  const result = await fetch(
    `https://api.rawg.io/api/games/${encodeURIComponent(id)}/screenshots?key=${process.env.RAWG_API_KEY}` ,
    {
      
    },
  );
  if (!result.ok) {
    const text = await result.text();
    console.log("game API error:", result.status, text);
    throw new APIError(
      result.status,
      "game service temporarily unavailable. Please try again.",
    );
  }
  const data = await result.json();
  if (!data?.results?.length)
    throw new APIError(404, data.Error || "No screenshot found");
  myCache.set(cacheKey, data , 124000);
  res
    .status(200)
    .json(new APIResponse(200, data, "game fetched successfully"));
});
const findTrailer = asyncHandler(async (req, res) => {
  const { id } = req.query;
  if (!id) {
    throw new APIError(400, "game id is required!");
  }

  const cacheKey = `trailer-${id}`;
  const cachedData = myCache.get(cacheKey);
  if (cachedData) {
    return res
      .status(200)
      .json(new APIResponse(200, cachedData, "Fetched from cache"));
  }
  const result = await fetch(
    `https://api.rawg.io/api/games/${encodeURIComponent(id)}/movies?key=${process.env.RAWG_API_KEY}` ,
    {
      
    },
  );
  if (!result.ok) {
    const text = await result.text();
    console.log("game API error:", result.status, text);
    throw new APIError(
      result.status,
      "game service temporarily unavailable. Please try again.",
    );
  }
  const data = await result.json();
  if (!data?.results?.length)
    throw new APIError(404, data.Error || "No trailer found");
  myCache.set(cacheKey, data,124000);
  res
    .status(200)
    .json(new APIResponse(200, data, "game fetched successfully"));
});

const addGame = asyncHandler(async(req , res)=> {
  const game = await Game.create({
    ...req.body ,
    userId : req.user.id
  })
  res.status(201).json(new APIResponse(201 , game , "Game added successfully"));
})
const getGame = asyncHandler(async(req,res) => {
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
  res.status(200).json(new APIResponse(200 , data , "User-Game fetched successfully"));
})
const updateGame = asyncHandler(async(req , res) => {
  const {id} = req.params;
  const {status , note , personalRating , favourite} = req.body;
  const s = await Game.findOneAndUpdate({
    userId : req.user.id,
    id,
  }, {
    status , review : note , personalRating , favourite
  } ,{
    new : true,
  })
  if(!s) throw new APIError(500 , "Game not updated");
  res.status(200).json(new APIResponse(200 , s , "Game updated successfully"));
})
const deleteGame = asyncHandler(async(req , res)=> {
  const {id} = req.params;
  const g = await Game.findOneAndDelete({
    id ,
    userId : req.user.id,
  })
  if(!g) throw new APIError(500 , "Game not deleted");
  res.status(200).json(new APIResponse(200 , g , "Game deleted successfully"));
})
export { findgame, findParticulargame , findScreenshots , findTrailer , addGame ,getGame , updateGame , deleteGame};
