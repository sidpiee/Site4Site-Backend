import { Router } from "express"
import { requireAuth } from "../middlewares/auth.middleware.js";
import {addTask, deleteTask, getTask, toggleTask, updateTask} from "../controllers/task.controller.js";

const router = Router();

router.route("/addTask").post(requireAuth , addTask);
router.route("/getTask").get(requireAuth , getTask);
router.route("/toggleTask/:id").patch(requireAuth , toggleTask);
router.route("/deleteTask/:id").delete(requireAuth , deleteTask );
router.route("/updateTask/:id").patch(requireAuth , updateTask);

export default router;