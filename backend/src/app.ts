import cors from "cors";
import express, { type ErrorRequestHandler } from "express";
import helmet from "helmet";
import { config } from "./config";
import { authRouter } from "./routes/auth";
import { gamesRouter } from "./routes/games";
import { libraryRouter } from "./routes/library";
import { profileRouter } from "./routes/profile";

export const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || config.frontendOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json({ limit: "16kb" }));

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok", service: "IE2A API" });
});
app.use("/api/auth", authRouter);
app.use("/api/games", gamesRouter);
app.use("/api/profile", profileRouter);
app.use("/api/library", libraryRouter);

app.use((_request, response) => {
  response.status(404).json({ error: "Rota não encontrada." });
});

const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof SyntaxError && "status" in error && error.status === 400) {
    response.status(400).json({ error: "O corpo da solicitação precisa ser JSON válido." });
    return;
  }
  console.error("Erro não tratado na API:", error);
  response.status(500).json({ error: "Erro interno. Tente novamente." });
};
app.use(errorHandler);
