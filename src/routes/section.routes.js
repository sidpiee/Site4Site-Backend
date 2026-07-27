import { Router } from "express"
import { requireAuth } from "../middlewares/auth.middleware.js";
import { addSection, addSite, deleteSection, deleteSite, getSection, updateSection, updateSite } from "../controllers/section.controller.js";
import { crudlimiter } from "../middlewares/ratelimit.crud.js";
const router = Router();

router.route("/section").post(requireAuth,crudlimiter,addSection).get(requireAuth ,crudlimiter, getSection );
router.route("/section/:id").delete(requireAuth,crudlimiter,deleteSection).patch(requireAuth ,crudlimiter, updateSection);
router.route("/section/site/:id").post(requireAuth ,crudlimiter, addSite );
router.route("/section/:sectionId/site/:id").delete(requireAuth ,crudlimiter, deleteSite).patch(requireAuth ,crudlimiter, updateSite);
export default router;