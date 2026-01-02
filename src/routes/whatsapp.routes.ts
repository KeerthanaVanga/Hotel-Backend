import { Router } from "express";
import { fetchWhatsappUsers } from "../controllers/whatsappUser.controller";
import { fetchWhatsappMessages } from "../controllers/whatsappUser.controller";

const router = Router();

router.get("/users", fetchWhatsappUsers);
router.get("/messages/:phone", fetchWhatsappMessages);


export default router;
