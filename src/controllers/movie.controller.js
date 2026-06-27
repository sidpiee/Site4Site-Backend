import { APIResponse } from "../utils/api-response.js";
import { APIError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import NodeCache from "node-cache";
import { Movie } from "../models/movie.model.js";

const myCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });
const findmovie = asyncHandler(async (req, res) => {
  const { movie } = req.query;
  if (!movie?.trim()) {
    throw new APIError(400, "Movie name is required!");
  }

  const normalizedMovie = movie.trim().toLowerCase();

  const cachedData = myCache.get(normalizedMovie);
  if (cachedData) {
    return res
      .status(200)
      .json(new APIResponse(200, cachedData, "Fetched from cache"));
  }
  const result = await fetch(
    `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&s=${encodeURIComponent(movie)}`,
    {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json",
      },
    },
  );
  if (!result.ok) {
    const text = await result.text();
    console.log("Movie API error:", result.status, text);
    throw new APIError(
      result.status,
      "movie service temporarily unavailable. Please try again.",
    );
  }
  const data = await result.json();
  if (data.Response === "False")
    throw new APIError(404, data.Error || "No movie found");
  myCache.set(normalizedMovie, data);
  res
    .status(200)
    .json(new APIResponse(200, data, "movie fetched successfully"));
});

const findParticularMovie = asyncHandler(async (req, res) => {
  const { movie } = req.query;
  if (!movie?.trim()) {
    throw new APIError(400, "Movie name is required!");
  }

  const normalizedMovie = movie.trim().toLowerCase();

  const cachedData = myCache.get(normalizedMovie);
  if (cachedData) {
    return res
      .status(200)
      .json(new APIResponse(200, cachedData, "Fetched from cache"));
  }
  const result = await fetch(
    `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=${encodeURIComponent(movie)}`,
    {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json",
      },
    },
  );
  if (!result.ok) {
    const text = await result.text();
    console.log("Movie API error:", result.status, text);
    throw new APIError(
      result.status,
      "movie service temporarily unavailable. Please try again.",
    );
  }
  const data = await result.json();
  if (data.Response === "False")
    throw new APIError(404, data.Error || "No movie found");
  myCache.set(normalizedMovie, data);
  res
    .status(200)
    .json(new APIResponse(200, data, "movie fetched successfully"));
});
const addMovie = asyncHandler(async(req , res)=> {
  try {
    const movie = await Movie.create({
      ...req.body , 
      userId :   req.user.id
    })
    res.status(201).json(new APIResponse(201 , movie , "Movie added sucessfully"));
  } catch (error) {
    throw new APIError(500 , error.message);
  }
})
const getMovie = asyncHandler(async(req,res) => {
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
  res.status(200).json(new APIResponse(200 , data , "User-Movie fetched successfully"));
})
const editMovie = asyncHandler(async(req ,res) => {
  const {id} = req.params ;
  const {status} = req.body ;
  

  if(!status || !id ) throw new APIError(500 , "No status or id recieved");
  const m = await Movie.findOneAndUpdate(
  {
    imdbID: id,
    userId: req.user.id,
  },
  {
    status,
  },
  { new: true }
);
if (!m) {
  throw new APIError(404, "Movie not found");
}

return res.status(200).json(new APIResponse(200 , m , "Movie updated successfully"));
})
export { findmovie, findParticularMovie , addMovie , getMovie ,editMovie};
