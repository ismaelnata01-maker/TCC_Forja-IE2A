
"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function Favoritos() {

    const [busca, setBusca] = useState("");

    const [jogos, setJogos] = useState([
        {
            id: 1,
            nome: "Battlefield 2042",
            categoria: "FPS / Guerra",
            descricao: "Entre em batalhas intensas em guerras de larga escala.",
            imagem: "BF",
            cor: "battlefield"
        },
        {
            id: 2,
            nome: "Fortnite",
            categoria: "Battle Royale",
            descricao: "Construa, lute e seja o último sobrevivente.",
            imagem: "FN",
            cor: "fortnite"
        },
        {
            id: 3,
            nome: "Grand Theft Auto V",
            categoria: "Mundo Aberto",
            descricao: "Explore Los Santos e viva sua própria história.",
            imagem: "GTA V",
            cor: "gta"
        },
        {
            id: 4,
            nome: "Cyberpunk 2077",
            categoria: "RPG / Ação",
            descricao: "Explore Night City em um futuro tecnológico.",
            imagem: "2077",
            cor: "cyberpunk"
        },
        {
            id: 5,
            nome: "Red Dead Redemption 2",
            categoria: "Aventura",
            descricao: "Viva uma jornada pelo Velho Oeste.",
            imagem: "RDR2",
            cor: "reddead"
        },
        {
            id: 6,
            nome: "Call of Duty: Modern Warfare III",
            categoria: "FPS / Guerra",
            descricao: "Participe de operações militares intensas.",
            imagem: "COD",
            cor: "cod"
        },
        {
            id: 7,
            nome: "Elden Ring",
            categoria: "RPG / Fantasia",
            descricao: "Enfrente criaturas e explore um mundo misterioso.",
            imagem: "ELDEN RING",
            cor: "elden"
        },
        {
            id: 8,
            nome: "Forza Horizon 5",
            categoria: "Corrida",
            descricao: "Corra em um mundo aberto inspirado no México.",
            imagem: "FORZA",
            cor: "forza"
        },
        {
            id: 9,
            nome: "The Witcher 3",
            categoria: "RPG / Aventura",
            descricao: "Acompanhe Geralt em uma aventura fantástica.",
            imagem: "WITCHER",
            cor: "witcher"
        },
        {
            id: 10,
            nome: "God of War Ragnarök",
            categoria: "Ação / Aventura",
            descricao: "Acompanhe Kratos e Atreus em uma jornada épica.",
            imagem: "GOD OF WAR",
            cor: "god"
        }
    ]);

    function removerFavorito(id: number) {
        setJogos(jogos.filter((jogo) => jogo.id !== id));
    }

    const jogosFiltrados = jogos.filter((jogo) =>
        jogo.nome.toLowerCase().includes(busca.toLowerCase())
    );

    return (
        <main className={styles.container}>

            <header className={styles.header}>
                <h1>IE<span>2A</span></h1>
                <a href="/dashboard">Voltar aos jogos</a>
            </header>

            <section className={styles.conteudo}>

                <div className={styles.titulo}>
                    <div>
                        <span className={styles.destaque}>
                            SUA BIBLIOTECA
                        </span>

                        <h2>Meus Favoritos <span>♥</span></h2>

                        <p>
                            Todos os seus jogos preferidos em um só lugar.
                        </p>
                    </div>

                    <div className={styles.contador}>
                        <strong>{jogos.length}</strong>
                        <span>Jogos salvos</span>
                    </div>
                </div>

                <div className={styles.pesquisa}>
                    <input
                        type="text"
                        placeholder="Pesquisar jogos..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                    />
                </div>

                {jogosFiltrados.length > 0 ? (

                    <div className={styles.lista}>

                        {jogosFiltrados.map((jogo) => (

                            <div className={styles.card} key={jogo.id}>

                                <div className={`${styles.capa} ${styles[jogo.cor]}`}>
                                    <span>{jogo.imagem}</span>
                                </div>

                                <div className={styles.info}>

                                    <span className={styles.categoria}>
                                        {jogo.categoria}
                                    </span>

                                    <h3>{jogo.nome}</h3>

                                    <p>{jogo.descricao}</p>

                                    <div className={styles.acoes}>

                                        <button
                                            className={styles.jogar}
                                            onClick={() => alert("Em breve!")}
                                        >
                                            Jogar agora
                                        </button>

                                        <button
                                            className={styles.remover}
                                            onClick={() => removerFavorito(jogo.id)}
                                            title="Remover dos favoritos"
                                        >
                                            ♥
                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                ) : (

                    <div className={styles.vazio}>
                        <span>♡</span>

                        <h3>
                            {jogos.length === 0
                                ? "Sua biblioteca está vazia"
                                : "Nenhum jogo encontrado"}
                        </h3>

                        <p>
                            {jogos.length === 0
                                ? "Explore os jogos e adicione seus favoritos!"
                                : "Tente pesquisar por outro nome."}
                        </p>

                        {jogos.length === 0 && (
                            <a href="/dashboard">Explorar jogos</a>
                        )}
                    </div>

                )}

            </section>

            <footer className={styles.footer}>
                © 2026 IE2A - Todos os direitos reservados.
            </footer>

        </main>
    );
}
