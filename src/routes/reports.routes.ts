import { Router } from "express";
import { getReports } from "../controllers/reports.controller";

const router = Router();

router.get("/summary", getReports);

export default router;
