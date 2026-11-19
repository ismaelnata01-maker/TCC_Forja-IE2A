import "dotenv/config";
import express from "express";
import routes from "./routes/routes";

const port = Number(process.env.PORT ?? 3333);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT deve ser um número entre 1 e 65535");
}

const app = express();

app.use(express.json());

app.get("/", (_request, response) => {
    return response.status(200).json({
        status: "ok",
        message: "Backend Forja está funcionando",
    });
});

app.use(routes);

app.listen(port, "127.0.0.1", () => {
    console.log(`Backend disponível em http://localhost:${port}`);
});
