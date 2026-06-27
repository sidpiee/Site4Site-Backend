import { Router } from "express";
import {
  addMovie,
  editMovie,
  findmovie,
  findParticularMovie,
  getMovie,
} from "../controllers/movie.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(findmovie);
router.route("/this").get(findParticularMovie);
router.route("/addMovie").post(requireAuth , addMovie);
router.route("/editMovie/:id").patch(requireAuth , editMovie);
router.route("/getMovie").get(requireAuth , getMovie);

export default router;
