import { Router } from "express";
import { findanime } from "../controllers/anime.controller.js";

const router = Router();

router.route("/").get(findanime);

export default router;
