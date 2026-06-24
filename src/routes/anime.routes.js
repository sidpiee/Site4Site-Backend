import { Router } from "express";
import { addAnime, findanime } from "../controllers/anime.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(findanime);
router.route("/addAnime").post(requireAuth , addAnime);

export default router;
