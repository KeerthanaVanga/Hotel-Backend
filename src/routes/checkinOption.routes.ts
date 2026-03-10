import { Router } from "express";
import { fetchAllCheckInOptions } from "../controllers/checkinOption.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
const router = Router();
router.use(requireAuth);
router.get("/", fetchAllCheckInOptions);
export default router;
