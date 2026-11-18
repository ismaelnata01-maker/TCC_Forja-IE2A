import "dotenv/config";
import path from "node:path";

function requiredSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32 || secret.startsWith("troque-")) {
    throw new Error(
      "Configure JWT_SECRET no arquivo .env com uma chave própria de pelo menos 32 caracteres.",
    );
  }
  return secret;
}

const port = Number(process.env.PORT ?? 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT precisa ser um número entre 1 e 65535.");
}

export const config = {
  port,
  databasePath: path.resolve(process.env.DATABASE_PATH ?? "./data/ie2a.sqlite"),
  jwtSecret: requiredSecret(),
  frontendOrigins: (process.env.FRONTEND_ORIGINS ?? "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
};
