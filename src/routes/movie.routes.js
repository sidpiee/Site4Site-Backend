import { Router } from "express";
import {
  addMovie,
  deleteMovie,
  editMovie,
  findmovie,
  findParticularMovie,
  getMovie,
  updateMovie,
} from "../controllers/movie.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(findmovie);
router.route("/this").get(findParticularMovie);
router.route("/addMovie").post(requireAuth , addMovie);
router.route("/editMovie/:id").patch(requireAuth , editMovie);
router.route("/getMovie").get(requireAuth , getMovie);
router.route("/updateMovie/:id").patch(requireAuth , updateMovie);
router.route("/deleteMovie/:id").delete(requireAuth , deleteMovie);

export default router;
