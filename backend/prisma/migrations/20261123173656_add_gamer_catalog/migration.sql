-- CreateTable
CREATE TABLE "Jogo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "genero" TEXT NOT NULL,
    "plataforma" TEXT NOT NULL,
    "imagemUrl" TEXT,
    "anoLancamento" INTEGER,
    "preco" REAL NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "ListaDesejos" (
    "funcionarioId" INTEGER NOT NULL,
    "jogoId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("funcionarioId", "jogoId"),
    CONSTRAINT "ListaDesejos_funcionarioId_fkey" FOREIGN KEY ("funcionarioId") REFERENCES "Funcionario" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ListaDesejos_jogoId_fkey" FOREIGN KEY ("jogoId") REFERENCES "Jogo" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Biblioteca" (
    "funcionarioId" INTEGER NOT NULL,
    "jogoId" INTEGER NOT NULL,
    "horasJogadas" REAL NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'NAO_INICIADO',
    "conquistas" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,

    PRIMARY KEY ("funcionarioId", "jogoId"),
    CONSTRAINT "Biblioteca_funcionarioId_fkey" FOREIGN KEY ("funcionarioId") REFERENCES "Funcionario" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Biblioteca_jogoId_fkey" FOREIGN KEY ("jogoId") REFERENCES "Jogo" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
