import { Router } from "express";
import { fetchAllReviews } from "../controllers/review.controller";

const router = Router();

router.get("/reviews", fetchAllReviews);

export default router;
