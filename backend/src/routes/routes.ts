import { Router } from "express";
import adminController from "../controllers/admin";

const router = Router();

router.post("/login", adminController.login);
router.post("/cadastro", adminController.create);

export default router;