import { Router } from "express";
import { addGame, deleteGame, findgame, findParticulargame, findScreenshots, findTrailer, getGame, updateGame } from "../controllers/games.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(findgame);
router.route("/this").get(findParticulargame);
router.route("/this/screenshots").get(findScreenshots);
router.route("/this/trailer").get(findTrailer);
router.route("/addGame").post(requireAuth , addGame);
router.route("/getGame").get(requireAuth , getGame);
router.route("/updateGame/:id").patch(requireAuth , updateGame);
router.route("/deleteGame/:id").delete(requireAuth , deleteGame);
export default router;
