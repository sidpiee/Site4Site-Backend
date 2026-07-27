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
import { searchlimiter } from "../middlewares/ratelimit.search.js";
import { crudlimiter } from "../middlewares/ratelimit.crud.js";

const router = Router();

router.route("/").get(searchlimiter,findmovie);
router.route("/this").get(searchlimiter,findParticularMovie);
router.route("/addMovie").post(requireAuth , crudlimiter,  addMovie);
router.route("/editMovie/:id").patch(requireAuth ,crudlimiter, editMovie);
router.route("/getMovie").get(requireAuth ,crudlimiter, getMovie);
router.route("/updateMovie/:id").patch(requireAuth ,crudlimiter, updateMovie);
router.route("/deleteMovie/:id").delete(requireAuth ,crudlimiter, deleteMovie);

export default router;
