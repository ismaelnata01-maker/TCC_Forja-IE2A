import { Router } from "express";
import adminController from "../controllers/admin";

const router = Router();

router.post("/login", adminController.login);

export default router;