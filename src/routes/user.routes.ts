import { Router } from "express";
import { fetchUsers,addUser,editUser } from "../controllers/user.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(requireAuth);
router.get("/users", fetchUsers);
router.post("/add", addUser);
router.put("/update/:id", editUser);

export default router;
