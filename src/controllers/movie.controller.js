import { APIResponse } from "../utils/api-response.js";
import { APIError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import NodeCache from "node-cache";

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
    `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&t=${encodeURIComponent(movie)}`,
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
  if (data.Response === "False") throw new APIError(404, "No movie found");
  myCache.set(normalizedMovie, data);
  res
    .status(200)
    .json(new APIResponse(200, data, "movie fetched successfully"));
});

export { findmovie };
