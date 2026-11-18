import { app } from "./app";
import { config } from "./config";
import { database } from "./database";

const server = app.listen(config.port, () => {
  console.log(`IE2A API disponível em http://localhost:${config.port}`);
  console.log(`Banco SQLite: ${config.databasePath}`);
});

function shutdown(): void {
  server.close(() => {
    database.close();
    console.log("Servidor IE2A encerrado.");
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
