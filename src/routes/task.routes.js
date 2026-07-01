import { Router } from "express"
import { requireAuth } from "../middlewares/auth.middleware.js";
import {addTask, getTask} from "../controllers/task.controller.js";

const router = Router();

router.route("/addTask").post(requireAuth , addTask);
router.route("/getTask").get(requireAuth , getTask);

export default router;