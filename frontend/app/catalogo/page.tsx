
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Sidebar from "@/componentes/sidebar";
import { Heart } from "lucide-react";
import styles from "./page.module.css";

// Lista de jogos
const todosOsJogos = [
    { id: 1, nome: "Cyberpunk 2077", imagem: "/jogos/cyberpunk.jpg", preco: "R$ 149,90", categoria: "RPG" },
    { id: 2, nome: "Red Dead Redemption 2", imagem: "/jogos/reddead.jpg", preco: "R$ 99,90", categoria: "Aventura" },
    { id: 3, nome: "Elden Ring", imagem: "/jogos/eldenring.jpg", preco: "R$ 199,90", categoria: "RPG" },
    { id: 4, nome: "Forza Horizon 5", imagem: "/jogos/forza.jpg", preco: "R$ 129,90", categoria: "Corrida" },
    { id: 5, nome: "Minecraft", imagem: "/jogos/minecraft.jpg", preco: "R$ 79,90", categoria: "Sandbox" },
    { id: 6, nome: "God of War Ragnarök", imagem: "/jogos/gow.jpg", preco: "R$ 249,90", categoria: "Ação" },
];

export default function CatalogoPage() {
    const [favoritos, setFavoritos] = useState<typeof todosOsJogos>([]);

    // Carrega os favoritos salvos
    useEffect(() => {
        const salvos = localStorage.getItem("jogosFavoritos");

        if (salvos) {
            try {
                setFavoritos(JSON.parse(salvos));
            } catch {
                setFavoritos([]);
            }
        }
    }, []);

    // Adiciona ou remove um jogo dos favoritos
    function alternarFavorito(jogo: typeof todosOsJogos[number]) {
        const jaFavoritado = favoritos.some((favorito) => favorito.id === jogo.id);

        const atualizados = jaFavoritado
            ? favoritos.filter((favorito) => favorito.id !== jogo.id)
            : [...favoritos, jogo];

        setFavoritos(atualizados);
        localStorage.setItem("jogosFavoritos", JSON.stringify(atualizados));
    }

    return (
        <main className={styles.main}>
            <Sidebar />

            <div className={styles.conteudo}>
                <header className={styles.headerCatalogo}>
                    <h1>Catálogo de Jogos</h1>
                    <p>
                        Explore todos os {todosOsJogos.length} jogos disponíveis na plataforma.
                    </p>
                </header>

                <div className={styles.listaJogos}>
                    {todosOsJogos.map((jogo) => {
                        const favoritado = favoritos.some(
                            (favorito) => favorito.id === jogo.id
                        );

                        return (
                            <article className={styles.cardJogo} key={jogo.id}>
                                <div className={styles.imagemJogo}>
                                    <Image
                                        src={jogo.imagem}
                                        alt={jogo.nome}
                                        fill
                                        sizes="(max-width: 700px) 80vw, 250px"
                                    />

                                    <button
                                        type="button"
                                        className={`${styles.botaoFavorito} ${
                                            favoritado ? styles.favoritado : ""
                                        }`}
                                        onClick={() => alternarFavorito(jogo)}
                                        aria-label={
                                            favoritado
                                                ? `Remover ${jogo.nome} dos favoritos`
                                                : `Adicionar ${jogo.nome} aos favoritos`
                                        }
                                    >
                                        <Heart
                                            size={19}
                                            fill={favoritado ? "currentColor" : "none"}
                                        />
                                    </button>
                                </div>

                                <div className={styles.infoJogo}>
                                    <p>{jogo.categoria}</p>
                                    <h3>{jogo.nome}</h3>

                                    <div className={styles.preco}>
                                        <span>{jogo.preco}</span>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
