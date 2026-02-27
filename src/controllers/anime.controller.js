import { APIResponse } from "../utils/api-response.js";
import { APIError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";

const findanime = asyncHandler(async (req, res) => {
  const { anime } = req.query;
  if (!anime?.trim()) {
    throw new APIError(400, "Anime name is required!");
  }
  const result = await fetch(
    `https://api.jikan.moe/v4/anime?q=${anime}&limit=5`,
  );
  if (!result.ok) {
    throw new APIError(result.status, "Unknown error occured");
  }
  const data = await result.json();
  if (data.data.length === 0) throw new APIError(404, "No anime found");
  res
    .status(200)
    .json(new APIResponse(200, data.data, "Anime fetched successfully"));
});

export { findanime };
