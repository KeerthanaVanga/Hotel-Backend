import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { fetchUpcomingBookingsForAllUsers,fetchTodayCheckOuts,fetchTodayCheckIns } from "../controllers/booking.controller";

const router = Router();

router.get("/checkins", fetchTodayCheckIns);
router.get("/checkouts", fetchTodayCheckOuts);
router.get("/upcoming", requireAuth, fetchUpcomingBookingsForAllUsers);

export default router;
