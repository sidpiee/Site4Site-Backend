import { Router } from "express";
import { addAnime, findanime, getAnime } from "../controllers/anime.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(findanime);
router.route("/addAnime").post(requireAuth , addAnime);
router.route("/getAnime").get(requireAuth , getAnime);

export default router;
