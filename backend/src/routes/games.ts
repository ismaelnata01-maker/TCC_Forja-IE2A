import { Router } from "express";
import { z } from "zod";
import { database } from "../database";
import { requireAuth } from "../middleware/auth";

export const gamesRouter = Router();

const gameInputSchema = z.object({
  title: z.string().trim().min(1).max(100),
  company: z.string().trim().min(1).max(100),
  genre: z.string().trim().min(1).max(50),
  description: z.string().trim().min(1).max(1000),
  coverUrl: z
    .string()
    .trim()
    .max(500)
    .refine(isHttpUrlOrEmpty, "A capa deve usar um link HTTP ou HTTPS.")
    .optional()
    .default(""),
  storeUrl: z
    .string()
    .trim()
    .max(500)
    .refine(isHttpUrlOrEmpty, "A loja deve usar um link HTTP ou HTTPS.")
    .optional()
    .default(""),
});

const listQuerySchema = z.object({
  q: z.string().trim().max(100).optional(),
  genre: z.string().trim().max(50).optional(),
  company: z.string().trim().max(100).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(24),
  offset: z.coerce.number().int().min(0).default(0),
});

function validationError(
  issues: Array<{ path: PropertyKey[]; message: string }>,
): { error: string; details: Array<{ field: string; message: string }> } {
  return {
    error: "Confira os dados enviados.",
    details: issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    })),
  };
}

function isHttpUrlOrEmpty(value: string): boolean {
  if (value === "") return true;
  if (!/^https?:\/\//i.test(value)) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

gamesRouter.get("/", (request, response) => {
  const parsed = listQuerySchema.safeParse(request.query);
  if (!parsed.success) {
    response.status(400).json(validationError(parsed.error.issues));
    return;
  }

  const { q, genre, company, limit, offset } = parsed.data;
  const filters: string[] = [];
  const values: Array<string | number> = [];

  if (q) {
    filters.push(
      "(fold_text(title) LIKE fold_text(?) OR fold_text(company) LIKE fold_text(?) OR fold_text(description) LIKE fold_text(?))",
    );
    values.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }
  if (genre) {
    filters.push("genre = ?");
    values.push(genre);
  }
  if (company) {
    filters.push("company LIKE ?");
    values.push(`%${company}%`);
  }

  const where = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";
  const total = (
    database.prepare(`SELECT COUNT(*) AS count FROM games ${where}`).get(...values) as {
      count: number;
    }
  ).count;
  const games = database
    .prepare(
      `SELECT id, title, company, genre, description, cover_url AS coverUrl,
              store_url AS storeUrl, featured, created_at AS createdAt
       FROM games ${where}
       ORDER BY featured DESC, title COLLATE NOCASE
       LIMIT ? OFFSET ?`,
    )
    .all(...values, limit, offset);

  response.json({ data: games, pagination: { total, limit, offset } });
});

gamesRouter.get("/:id", (request, response) => {
  const id = Number(request.params.id);
  if (!Number.isInteger(id) || id < 1) {
    response.status(400).json({ error: "Identificador de jogo inválido." });
    return;
  }

  const game = database
    .prepare(
      `SELECT id, title, company, genre, description, cover_url AS coverUrl,
              store_url AS storeUrl, featured, created_at AS createdAt
       FROM games WHERE id = ?`,
    )
    .get(id);

  if (!game) {
    response.status(404).json({ error: "Jogo não encontrado." });
    return;
  }
  response.json(game);
});

gamesRouter.post("/", requireAuth, (request, response) => {
  const parsed = gameInputSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json(validationError(parsed.error.issues));
    return;
  }

  const game = parsed.data;
  const result = database
    .prepare(
      `INSERT INTO games (title, company, genre, description, cover_url, store_url, created_by)
       VALUES (@title, @company, @genre, @description, @coverUrl, @storeUrl, @createdBy)`,
    )
    .run({ ...game, createdBy: request.userId });

  const createdGame = database
    .prepare(
      `SELECT id, title, company, genre, description, cover_url AS coverUrl,
              store_url AS storeUrl, featured, created_at AS createdAt
       FROM games WHERE id = ?`,
    )
    .get(Number(result.lastInsertRowid));

  response.status(201).json(createdGame);
});
