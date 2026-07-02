import { Router } from "express"
import { requireAuth } from "../middlewares/auth.middleware.js";
import { addSection, deleteSection, getSection } from "../controllers/section.controller.js";
const router = Router();

router.route("/section").post(requireAuth,addSection).get(requireAuth , getSection );
router.route("/section/:id").delete(requireAuth,deleteSection);
export default router;