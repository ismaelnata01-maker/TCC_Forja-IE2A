import { Router } from "express";
import adminController from "../controllers/admin";
import gamesController from "../controllers/games";
import { authentication } from "../middleware/authentication";
import { isAdmin } from "../middleware/permissions";

const router = Router();

router.post("/login", adminController.login);
router.post("/cadastro", adminController.create);
router.get("/me", authentication, adminController.me);
router.post("/logout", (_request, response) => response.status(200).json("Sessão encerrada"));
router.get("/jogos", gamesController.list);
router.get("/jogos/:id", gamesController.getById);
router.post("/jogos", authentication, isAdmin, gamesController.create);
router.put("/jogos/:id", authentication, isAdmin, gamesController.update);
router.delete("/jogos/:id", authentication, isAdmin, gamesController.delete);

router.get("/desejos", authentication, gamesController.listWishlist);
router.post("/desejos/:jogoId", authentication, gamesController.addWishlist);
router.delete("/desejos/:jogoId", authentication, gamesController.removeWishlist);

router.get("/biblioteca", authentication, gamesController.listLibrary);
router.post("/biblioteca/:jogoId", authentication, gamesController.addToLibrary);
router.put("/biblioteca/:jogoId", authentication, gamesController.updateLibrary);
router.delete("/biblioteca/:jogoId", authentication, gamesController.removeFromLibrary);

export default router;