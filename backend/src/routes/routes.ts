import { Router } from "express";
import adminController from "../controllers/admin";
import gamesController from "../controllers/games";
import wishlistController from "../controllers/desejos";
import libraryController from "../controllers/biblioteca";
import { authentication } from "../middleware/authentication";
import { isAdmin, isAdminOrHimself } from "../middleware/permissions";

const router = Router();

router.post("/login", adminController.login);
router.post("/cadastro", adminController.create);
router.get("/me", authentication, adminController.me);
router.post("/logout", (_request, response) => response.status(200).json("Sessão encerrada"));
router.get("/funcionarios", authentication, isAdmin, adminController.list);
router.get("/funcionarios/:id", authentication, isAdminOrHimself, adminController.getById);
router.put("/funcionarios/:id", authentication, isAdminOrHimself, adminController.update);
router.delete("/funcionarios/:id", authentication, isAdmin, adminController.delete);
router.get("/jogos", gamesController.list);
router.get("/jogos/:id", gamesController.getById);
router.post("/jogos", authentication, isAdmin, gamesController.create);
router.put("/jogos/:id", authentication, isAdmin, gamesController.update);
router.delete("/jogos/:id", authentication, isAdmin, gamesController.delete);

router.get("/desejos", authentication, wishlistController.list);
router.post("/desejos/:jogoId", authentication, wishlistController.add);
router.delete("/desejos/:jogoId", authentication, wishlistController.remove);

router.get("/biblioteca", authentication, libraryController.list);
router.post("/biblioteca/:jogoId", authentication, libraryController.add);
router.put("/biblioteca/:jogoId", authentication, libraryController.update);
router.delete("/biblioteca/:jogoId", authentication, libraryController.remove);

export default router;