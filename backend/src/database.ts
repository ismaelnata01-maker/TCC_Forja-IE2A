import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { config } from "./config";

fs.mkdirSync(path.dirname(config.databasePath), { recursive: true });

export const database = new Database(config.databasePath);
database.pragma("foreign_keys = ON");
database.pragma("journal_mode = WAL");
database.function("fold_text", (value: string) =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(),
);

database.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    display_name TEXT NOT NULL,
    avatar_url TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    genre TEXT NOT NULL,
    description TEXT NOT NULL,
    cover_url TEXT NOT NULL DEFAULT '',
    store_url TEXT NOT NULL DEFAULT '',
    featured INTEGER NOT NULL DEFAULT 0 CHECK (featured IN (0, 1)),
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS library (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    game_id INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    added_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, game_id)
  );

  CREATE INDEX IF NOT EXISTS idx_games_title ON games(title COLLATE NOCASE);
  CREATE INDEX IF NOT EXISTS idx_games_genre ON games(genre COLLATE NOCASE);
  CREATE INDEX IF NOT EXISTS idx_library_user ON library(user_id, added_at);
`);

const starterGames = [
  {
    title: "Hollow Knight",
    company: "Team Cherry",
    genre: "Aventura",
    description: "Explore um reino subterrâneo desenhado à mão, cheio de segredos e desafios.",
    storeUrl: "https://store.steampowered.com/app/367520/Hollow_Knight/",
  },
  {
    title: "Stardew Valley",
    company: "ConcernedApe",
    genre: "Simulação",
    description: "Cuide da sua fazenda, conheça a comunidade e construa uma nova rotina.",
    storeUrl: "https://store.steampowered.com/app/413150/Stardew_Valley/",
  },
  {
    title: "Celeste",
    company: "Maddy Makes Games",
    genre: "Plataforma",
    description: "Ajude Madeline a escalar uma montanha em uma jornada de precisão e superação.",
    storeUrl: "https://store.steampowered.com/app/504230/Celeste/",
  },
  {
    title: "Hades",
    company: "Supergiant Games",
    genre: "Ação",
    description: "Lute para sair do submundo em uma aventura de ação que muda a cada tentativa.",
    storeUrl: "https://store.steampowered.com/app/1145360/Hades/",
  },
];

const gameCount = database.prepare("SELECT COUNT(*) AS count FROM games").get() as {
  count: number;
};

if (gameCount.count === 0) {
  const insertGame = database.prepare(`
    INSERT INTO games (title, company, genre, description, store_url, featured)
    VALUES (@title, @company, @genre, @description, @storeUrl, 1)
  `);
  const seedGames = database.transaction(() => {
    for (const game of starterGames) insertGame.run(game);
  });
  seedGames();
}
