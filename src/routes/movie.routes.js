import { Router } from "express";
import { findmovie } from "../controllers/movie.controller.js";

const router = Router();

router.route("/").get(findmovie);

export default router;
