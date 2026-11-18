import { Router } from "express";
import { database } from "../database";
import { requireAuth } from "../middleware/auth";

export const libraryRouter = Router();

libraryRouter.use(requireAuth);

libraryRouter.get("/", (request, response) => {
  const userId = request.userId as number;
  const games = database
    .prepare(
      `SELECT games.id, games.title, games.company, games.genre, games.description,
              games.cover_url AS coverUrl, games.store_url AS storeUrl,
              games.featured, library.added_at AS addedAt
       FROM library
       JOIN games ON games.id = library.game_id
       WHERE library.user_id = ?
       ORDER BY library.added_at DESC`,
    )
    .all(userId);
  response.json({ data: games, total: games.length });
});

libraryRouter.post("/:gameId", (request, response) => {
  const gameId = Number(request.params.gameId);
  if (!Number.isInteger(gameId) || gameId < 1) {
    response.status(400).json({ error: "Identificador de jogo inválido." });
    return;
  }

  const game = database.prepare("SELECT id FROM games WHERE id = ?").get(gameId);
  if (!game) {
    response.status(404).json({ error: "Jogo não encontrado." });
    return;
  }

  database
    .prepare("INSERT OR IGNORE INTO library (user_id, game_id) VALUES (?, ?)")
    .run(request.userId, gameId);
  response.status(200).json({ gameId, inLibrary: true });
});

libraryRouter.delete("/:gameId", (request, response) => {
  const gameId = Number(request.params.gameId);
  if (!Number.isInteger(gameId) || gameId < 1) {
    response.status(400).json({ error: "Identificador de jogo inválido." });
    return;
  }

  database.prepare("DELETE FROM library WHERE user_id = ? AND game_id = ?").run(
    request.userId,
    gameId,
  );
  response.json({ gameId, inLibrary: false });
});
