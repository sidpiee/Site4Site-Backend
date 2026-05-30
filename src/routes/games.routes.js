import { Router } from "express";
import { findgame, findParticulargame, findScreenshots, findTrailer } from "../controllers/games.controller.js";

const router = Router();

router.route("/").get(findgame);
router.route("/this").get(findParticulargame);
router.route("/this/screenshots").get(findScreenshots);
router.route("/this/trailer").get(findTrailer);
export default router;
