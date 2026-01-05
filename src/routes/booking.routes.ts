import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { fetchUpcomingBookingsForAllUsers,fetchTodayCheckOuts,fetchTodayCheckIns } from "../controllers/booking.controller";

const router = Router();
router.use(requireAuth);
router.get("/checkins", fetchTodayCheckIns);
router.get("/checkouts", fetchTodayCheckOuts);
router.get("/upcoming", requireAuth, fetchUpcomingBookingsForAllUsers);

export default router;
