import { Router } from "express";
import { addGame, deleteGame, findgame, findParticulargame, findScreenshots, findTrailer, getGame, updateGame } from "../controllers/games.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { searchlimiter } from "../middlewares/ratelimit.search.js";
import { crudlimiter } from "../middlewares/ratelimit.crud.js";

const router = Router();

router.route("/").get(searchlimiter,findgame);
router.route("/this").get(searchlimiter,findParticulargame);
router.route("/this/screenshots").get(searchlimiter , findScreenshots);
router.route("/this/trailer").get(searchlimiter , findTrailer);
router.route("/addGame").post(requireAuth ,crudlimiter, addGame);
router.route("/getGame").get(requireAuth ,crudlimiter, getGame);
router.route("/updateGame/:id").patch(requireAuth ,crudlimiter , updateGame);
router.route("/deleteGame/:id").delete(requireAuth ,crudlimiter ,  deleteGame);
export default router;
