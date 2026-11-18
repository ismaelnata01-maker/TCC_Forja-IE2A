import { compare, hash } from "bcryptjs";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { config } from "../config";
import { database } from "../database";
import { requireAuth } from "../middleware/auth";

export const authRouter = Router();

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Informe um e-mail válido.")
  .max(254, "O e-mail deve ter até 254 caracteres.");

const passwordSchema = z
  .string()
  .min(8, "A senha deve ter pelo menos 8 caracteres.")
  .refine((password) => Buffer.byteLength(password, "utf8") <= 72, {
    message: "A senha deve ter no máximo 72 bytes.",
  });

const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  displayName: z.string().trim().min(2).max(40),
});

const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(1)
    .refine((password) => Buffer.byteLength(password, "utf8") <= 72, {
      message: "A senha deve ter no máximo 72 bytes.",
    }),
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

function createToken(userId: number): string {
  return jwt.sign({}, config.jwtSecret, { subject: String(userId), expiresIn: "7d" });
}

authRouter.post("/register", async (request, response) => {
  const parsed = registerSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json(validationError(parsed.error.issues));
    return;
  }

  const { email, password, displayName } = parsed.data;
  const existingUser = database.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existingUser) {
    response.status(409).json({ error: "Este e-mail já possui uma conta." });
    return;
  }

  const passwordHash = await hash(password, 10);
  try {
    const result = database
      .prepare("INSERT INTO users (email, password_hash, display_name) VALUES (?, ?, ?)")
      .run(email, passwordHash, displayName);
    const id = Number(result.lastInsertRowid);
    response.status(201).json({
      token: createToken(id),
      user: { id, email, displayName, avatarUrl: "" },
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("UNIQUE constraint failed")) {
      response.status(409).json({ error: "Este e-mail já possui uma conta." });
      return;
    }
    throw error;
  }
});

authRouter.post("/login", async (request, response) => {
  const parsed = loginSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json(validationError(parsed.error.issues));
    return;
  }

  const user = database
    .prepare(
      "SELECT id, email, password_hash, display_name, avatar_url FROM users WHERE email = ?",
    )
    .get(parsed.data.email) as
    | {
        id: number;
        email: string;
        password_hash: string;
        display_name: string;
        avatar_url: string;
      }
    | undefined;

  if (!user || !(await compare(parsed.data.password, user.password_hash))) {
    response.status(401).json({ error: "E-mail ou senha incorretos." });
    return;
  }

  response.json({
    token: createToken(user.id),
    user: {
      id: user.id,
      email: user.email,
      displayName: user.display_name,
      avatarUrl: user.avatar_url,
    },
  });
});

authRouter.get("/me", requireAuth, (request, response) => {
  const user = database
    .prepare("SELECT id, email, display_name, avatar_url FROM users WHERE id = ?")
    .get(request.userId) as
    | { id: number; email: string; display_name: string; avatar_url: string }
    | undefined;

  if (!user) {
    response.status(404).json({ error: "Conta não encontrada." });
    return;
  }

  response.json({
    id: user.id,
    email: user.email,
    displayName: user.display_name,
    avatarUrl: user.avatar_url,
  });
});
