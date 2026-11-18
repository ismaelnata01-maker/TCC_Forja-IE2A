import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";

export function requireAuth(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authorization = request.header("authorization");
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : "";

  if (!token) {
    response.status(401).json({ error: "Faça login para continuar." });
    return;
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    if (
      typeof payload !== "object" ||
      payload === null ||
      typeof payload.sub !== "string" ||
      !/^[1-9]\d*$/.test(payload.sub)
    ) {
      response.status(401).json({ error: "Sessão inválida. Entre novamente." });
      return;
    }

    request.userId = Number(payload.sub);
    next();
  } catch {
    response.status(401).json({ error: "Sessão expirada ou inválida. Entre novamente." });
  }
}
