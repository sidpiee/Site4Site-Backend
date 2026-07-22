import { APIResponse } from "../utils/api-response.js";
import { APIError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import NodeCache from "node-cache";
import { Anime } from "../models/anime.model.js";


const myCache = new NodeCache({ stdTTL: 86400, checkperiod: 600 });
// const findanime = asyncHandler(async (req, res) => {
//   const { anime } = req.query;
//   if (!anime?.trim()) {
//     throw new APIError(400, "Anime name is required!");
//   }

//   const cachedData = myCache.get(anime);
//   if (cachedData) {
//     return res
//       .status(200)
//       .json(new APIResponse(200, cachedData, "Fetched from cache"));
//   }
//   const result = await fetch(
//     `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(anime)}&limit=8`,
//     {
//       headers: {
//         "User-Agent": "Mozilla/5.0",
//         Accept: "application/json",
//          "Accept-Encoding": "gzip, deflate, br, zstd",
//       },
//     },
//   );
//   if (!result.ok) {
//     const text = await result.text();
//     console.log("Jikan API error:", text);
//     throw new APIError(
//       result.status,
//       "Anime service temporarily unavailable. Please try again.",
//     );
//   }
//   const data = await result.json();
//   if (data.data.length === 0) throw new APIError(404, "No anime found");
//   myCache.set(anime, data.data);
//   res
//     .status(200)
//     .json(new APIResponse(200, data.data, "Anime fetched successfully"));
// });
const findanime = asyncHandler(async (req, res) => {
  const searchTerm = req.query.anime?.trim();

  if (!searchTerm) {
    throw new APIError(400, "Anime name is required!");
  }

  const cacheKey = searchTerm.toLowerCase();
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
    const errorText = await response.text();
    console.error("Kitsu API error:", response.status, errorText);

    throw new APIError(
      response.status,
      "Anime service temporarily unavailable. Please try again."
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
      genres : [] ,

      // Your schema requires a number, while Kitsu may return null.
      episodes: attributes.episodeCount ?? 0,
    };
  });

  myCache.set(cacheKey, animeList);
  return res
    .status(200)
    .json(new APIResponse(200, animeList, "Anime fetched successfully"));
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
const updateAnime = asyncHandler(async(req,res) => {
  const {id} = req.params;
  const {status , episodesWatched , notes , rating} = req.body;
  const a = await Anime.findOneAndUpdate({
    userId : req.user.id ,
    mal_id : Number(id) ,
  },
  {
    status , 
    episodesWatched , 
    notes ,
    rating,
  },
  {new : true}
)
if(!a) throw new APIError(404 , "Anime not updated");
res.status(200).json(new APIResponse(200 , a , "Anime updated successfully"));
})
const deleteAnime = asyncHandler(async(req , res) => {
  const {id} = req.params;
  const a = await Anime.findOneAndDelete({
    userId : req.user.id,
    mal_id : id,
  })
  if(!a) throw new APIError(500 , "Anime not deleted");
  res.status(200).json(new APIResponse(200 , a , "Anime deleted successfully"));
})
export { findanime , addAnime , getAnime , updateAnime , deleteAnime};
