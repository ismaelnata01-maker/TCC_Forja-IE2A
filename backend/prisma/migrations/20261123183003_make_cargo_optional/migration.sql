-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Funcionario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cargo" TEXT,
    "nascimento" DATETIME,
    "cpf" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "telefone" TEXT,
    "endereco" TEXT
);
INSERT INTO "new_Funcionario" ("cargo", "cpf", "email", "endereco", "id", "nascimento", "nome", "senha", "telefone") SELECT "cargo", "cpf", "email", "endereco", "id", "nascimento", "nome", "senha", "telefone" FROM "Funcionario";
DROP TABLE "Funcionario";
ALTER TABLE "new_Funcionario" RENAME TO "Funcionario";
CREATE UNIQUE INDEX "Funcionario_email_key" ON "Funcionario"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
