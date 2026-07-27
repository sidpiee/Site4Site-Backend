import { Router } from "express";
import { addAnime, deleteAnime, findanime, getAnime, getAnimeGenres, updateAnime } from "../controllers/anime.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { searchlimiter } from "../middlewares/ratelimit.search.js";
import { crudlimiter } from "../middlewares/ratelimit.crud.js";

const router = Router();

router.route("/").get(searchlimiter , findanime);
router.route("/getGenres/:id").get(searchlimiter , getAnimeGenres);
router.route("/addAnime").post(requireAuth ,crudlimiter, addAnime);
router.route("/getAnime").get(requireAuth ,crudlimiter, getAnime);
router.route("/updateAnime/:id").patch(requireAuth ,crudlimiter, updateAnime );
router.route("/deleteAnime/:id").delete(requireAuth ,crudlimiter, deleteAnime );


export default router;
