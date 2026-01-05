import { Router } from "express";
import {
  createUser,
  loginUser,
  logoutUser,
  refreshToken,
  checkUser,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/signup", createUser);
router.post("/login", loginUser);
router.post("/logout", requireAuth, logoutUser);
router.post("/refresh", refreshToken);
router.get("/me", requireAuth, checkUser);

export default router;
