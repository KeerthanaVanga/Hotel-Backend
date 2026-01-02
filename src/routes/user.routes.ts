import { Router } from "express";
import { fetchUsers } from "../controllers/user.controller";

const router = Router();

router.get("/users", fetchUsers);

export default router;
