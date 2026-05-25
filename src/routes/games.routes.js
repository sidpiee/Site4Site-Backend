import { Router } from "express";
import { findgame, findParticulargame } from "../controllers/games.controller.js";

const router = Router();

router.route("/").get(findgame);
router.route("/this").get(findParticulargame);

export default router;
