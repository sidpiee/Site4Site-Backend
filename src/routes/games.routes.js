import { Router } from "express";
import { addGame, findgame, findParticulargame, findScreenshots, findTrailer, getGame } from "../controllers/games.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(findgame);
router.route("/this").get(findParticulargame);
router.route("/this/screenshots").get(findScreenshots);
router.route("/this/trailer").get(findTrailer);
router.route("/addGame").post(requireAuth , addGame);
router.route("/getGame").get(requireAuth , getGame);
export default router;
