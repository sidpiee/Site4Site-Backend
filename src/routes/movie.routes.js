import { Router } from "express";
import {
  findmovie,
  findParticularMovie,
} from "../controllers/movie.controller.js";

const router = Router();

router.route("/").get(findmovie);
router.route("/this").get(findParticularMovie);

export default router;
