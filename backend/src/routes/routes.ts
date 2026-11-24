import { Router } from "express";
import adminController from "../controllers/admin";
import bibliotecaController from "../controllers/biblioteca";
import desejosController from "../controllers/desejos";
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

router.get("/desejos", authentication, desejosController.list);
router.post("/desejos/:jogoId", authentication, desejosController.add);
router.delete("/desejos/:jogoId", authentication, desejosController.remove);

router.get("/biblioteca", authentication, bibliotecaController.list);
router.post("/biblioteca/:jogoId", authentication, bibliotecaController.add);
router.put("/biblioteca/:jogoId", authentication, bibliotecaController.update);
router.delete("/biblioteca/:jogoId", authentication, bibliotecaController.remove);

export default router;