import "dotenv/config";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import routes from "./routes/routes";

const port = Number(process.env.PORT ?? 3333);

export const app = express();

app.use(express.json());
app.use(helmet());
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
}));

app.get("/", (_request, response) => {
    return response.status(200).json({
        status: "ok",
        message: "Backend Forja está funcionando",
    });
});

app.use(routes);

if (require.main === module) {
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
        throw new Error("PORT deve ser um número entre 1 e 65535");
    }
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET nao configurado");
    }
    app.listen(port, "127.0.0.1", () => {
        console.log(`Backend disponível em http://localhost:${port}`);
    });
}
