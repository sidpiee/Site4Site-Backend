import { APIResponse } from "../utils/api-response.js";
import { APIError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import NodeCache from "node-cache";
import { Anime } from "../models/anime.model.js";


const myCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });
const findanime = asyncHandler(async (req, res) => {
  const { anime } = req.query;
  if (!anime?.trim()) {
    throw new APIError(400, "Anime name is required!");
  }

  const cachedData = myCache.get(anime);
  if (cachedData) {
    return res
      .status(200)
      .json(new APIResponse(200, cachedData, "Fetched from cache"));
  }
  const result = await fetch(
    `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(anime)}&limit=8`,
    {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json",
      },
    },
  );
  if (!result.ok) {
    const text = await result.text();
    console.log("Jikan API error:", text);
    throw new APIError(
      result.status,
      "Anime service temporarily unavailable. Please try again.",
    );
  }
  const data = await result.json();
  if (data.data.length === 0) throw new APIError(404, "No anime found");
  myCache.set(anime, data.data);
  res
    .status(200)
    .json(new APIResponse(200, data.data, "Anime fetched successfully"));
});

const addAnime = asyncHandler(async(req,res) =>{
   try {
    const anime = await Anime.create({
      ...req.body ,
      userId : req.user.id,
      image : req.body.images.jpg.large_image_url,
    });

    res.status(201).json(new APIResponse(201 , anime , "Anime saved successfully"));
  } catch (error) {
    throw new APIError(500 , error.message)
  }
})
const getAnime = asyncHandler(async (req , res) => {
  try {
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
    res.status(200).json(new APIResponse(200 , data , "User-Anime fetched successfully"));
  }
  catch(error){
    throw new APIError(500 , error.message);
  }
})
export { findanime , addAnime , getAnime};
