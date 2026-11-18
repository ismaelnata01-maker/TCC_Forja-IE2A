import { Router } from "express";
import { z } from "zod";
import { database } from "../database";
import { requireAuth } from "../middleware/auth";

export const profileRouter = Router();

const updateProfileSchema = z
  .object({
    displayName: z.string().trim().min(2).max(40).optional(),
    avatarUrl: z
      .string()
      .trim()
      .max(500)
      .refine((value) => {
        if (value === "") return true;
        try {
          const url = new URL(value);
          return url.protocol === "http:" || url.protocol === "https:";
        } catch {
          return false;
        }
      }, "A imagem deve usar um link HTTP ou HTTPS.")
      .optional(),
  })
  .refine((profile) => profile.displayName !== undefined || profile.avatarUrl !== undefined, {
    message: "Informe ao menos um campo para atualizar.",
  });

profileRouter.use(requireAuth);

profileRouter.get("/", (request, response) => {
  const profile = database
    .prepare(
      `SELECT users.id, users.email, users.display_name AS displayName,
              users.avatar_url AS avatarUrl, users.created_at AS createdAt,
              (SELECT COUNT(*) FROM library WHERE library.user_id = users.id) AS libraryCount
       FROM users WHERE users.id = ?`,
    )
    .get(request.userId);

  if (!profile) {
    response.status(404).json({ error: "Conta não encontrada." });
    return;
  }
  response.json(profile);
});

profileRouter.patch("/", (request, response) => {
  const parsed = updateProfileSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({
      error: "Confira os dados enviados.",
      details: parsed.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  const fields: string[] = [];
  const values: Array<string | number> = [];
  if (parsed.data.displayName !== undefined) {
    fields.push("display_name = ?");
    values.push(parsed.data.displayName);
  }
  if (parsed.data.avatarUrl !== undefined) {
    fields.push("avatar_url = ?");
    values.push(parsed.data.avatarUrl);
  }
  values.push(request.userId as number);
  database.prepare(`UPDATE users SET ${fields.join(", ")} WHERE id = ?`).run(...values);

  const profile = database
    .prepare(
      `SELECT id, email, display_name AS displayName,
              avatar_url AS avatarUrl, created_at AS createdAt
       FROM users WHERE id = ?`,
    )
    .get(request.userId);
  response.json(profile);
});
