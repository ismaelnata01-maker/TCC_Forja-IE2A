import "dotenv/config";
import { prisma } from "../config/prisma";

const jogos = [
    {
        titulo: "Cyberpunk 2077",
        descricao: "RPG de mundo aberto ambientado em Night City.",
        genero: "RPG",
        plataforma: "PC",
        imagemUrl: "/jogos/cyberpunk.jpg",
        anoLancamento: 2020,
        preco: 149.9,
    },
    {
        titulo: "Red Dead Redemption 2",
        descricao: "Aventura de mundo aberto no Velho Oeste.",
        genero: "Aventura",
        plataforma: "PC",
        imagemUrl: "/jogos/reddead.jpg",
        anoLancamento: 2018,
        preco: 99.9,
    },
    {
        titulo: "Elden Ring",
        descricao: "RPG de ação em um vasto mundo de fantasia.",
        genero: "RPG",
        plataforma: "PC",
        imagemUrl: "/jogos/eldenring.jpg",
        anoLancamento: 2022,
        preco: 199.9,
    },
    {
        titulo: "Forza Horizon 5",
        descricao: "Jogo de corrida em mundo aberto no México.",
        genero: "Corrida",
        plataforma: "PC",
        imagemUrl: "/jogos/forza.jpg",
        anoLancamento: 2021,
        preco: 129.9,
    },
];

async function seedGames() {
    for (const jogo of jogos) {
        const existente = await prisma.jogo.findFirst({
            where: { titulo: jogo.titulo },
            select: { id: true },
        });
        if (!existente) {
            await prisma.jogo.create({ data: jogo });
        }
    }
    console.log(`${jogos.length} jogos iniciais verificados`);
}

seedGames()
    .catch((error: unknown) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
