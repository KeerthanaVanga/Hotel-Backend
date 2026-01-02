import { Router } from "express";
import { fetchAllUsersPayments } from "../controllers/payment.controller";

const router = Router();

// Admin-style endpoint
router.get("/payments", fetchAllUsersPayments);

export default router;
