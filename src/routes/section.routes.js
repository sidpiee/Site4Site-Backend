import { Router } from "express"
import { requireAuth } from "../middlewares/auth.middleware.js";
import { addSection, addSite, deleteSection, deleteSite, getSection } from "../controllers/section.controller.js";
const router = Router();

router.route("/section").post(requireAuth,addSection).get(requireAuth , getSection );
router.route("/section/:id").delete(requireAuth,deleteSection);
router.route("/section/site/:id").post(requireAuth , addSite );
router.route("/section/:sectionId/site/:id").delete(requireAuth , deleteSite);
export default router;