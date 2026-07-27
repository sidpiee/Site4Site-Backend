import { Router } from "express"
import { requireAuth } from "../middlewares/auth.middleware.js";
import {addTask, deleteTask, getTask, toggleTask, updateTask} from "../controllers/task.controller.js";
import { crudlimiter } from "../middlewares/ratelimit.crud.js";

const router = Router();

router.route("/addTask").post(requireAuth ,crudlimiter, addTask);
router.route("/getTask").get(requireAuth ,crudlimiter, getTask);
router.route("/toggleTask/:id").patch(requireAuth ,crudlimiter, toggleTask);
router.route("/deleteTask/:id").delete(requireAuth ,crudlimiter, deleteTask );
router.route("/updateTask/:id").patch(requireAuth ,crudlimiter, updateTask);

export default router;