
"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import Sidebar from "@/componentes/sidebar";

import {
    Search,
    Bell,
    User,
    Heart,
    Gamepad2,
    Trash2,
    ArrowRight,
} from "lucide-react";

const jogosIniciais = [
    {
        id: 1,
        nome: "Battlefield 2042",
        categoria: "FPS / Guerra",
        descricao: "Entre em batalhas intensas em guerras de larga escala.",
        imagem: "BF",
        cor: "battlefield",
    },
    {
        id: 2,
        nome: "Fortnite",
        categoria: "Battle Royale",
        descricao: "Construa, lute e seja o último sobrevivente.",
        imagem: "FN",
        cor: "fortnite",
    },
    {
        id: 3,
        nome: "Grand Theft Auto V",
        categoria: "Mundo Aberto",
        descricao: "Explore Los Santos e viva sua própria história.",
        imagem: "GTA V",
        cor: "gta",
    },
    {
        id: 4,
        nome: "Cyberpunk 2077",
        categoria: "RPG / Ação",
        descricao: "Explore Night City em um futuro tecnológico.",
        imagem: "2077",
        cor: "cyberpunk",
    },
    {
        id: 5,
        nome: "Red Dead Redemption 2",
        categoria: "Aventura",
        descricao: "Viva uma jornada pelo Velho Oeste.",
        imagem: "RDR2",
        cor: "reddead",
    },
    {
        id: 6,
        nome: "Call of Duty: Modern Warfare III",
        categoria: "FPS / Guerra",
        descricao: "Participe de operações militares intensas.",
        imagem: "COD",
        cor: "cod",
    },
    {
        id: 7,
        nome: "Elden Ring",
        categoria: "RPG / Fantasia",
        descricao: "Enfrente criaturas e explore um mundo misterioso.",
        imagem: "ELDEN RING",
        cor: "elden",
    },
    {
        id: 8,
        nome: "Forza Horizon 5",
        categoria: "Corrida",
        descricao: "Corra em um mundo aberto inspirado no México.",
        imagem: "FORZA",
        cor: "forza",
    },
    {
        id: 9,
        nome: "The Witcher 3",
        categoria: "RPG / Aventura",
        descricao: "Acompanhe Geralt em uma aventura fantástica.",
        imagem: "WITCHER",
        cor: "witcher",
    },
    {
        id: 10,
        nome: "God of War Ragnarök",
        categoria: "Ação / Aventura",
        descricao: "Acompanhe Kratos e Atreus em uma jornada épica.",
        imagem: "GOD OF WAR",
        cor: "god",
    },
];

export default function Favoritos() {
    const [busca, setBusca] = useState("");
    const [jogos, setJogos] = useState(jogosIniciais);

    function removerFavorito(id: number) {
        setJogos((jogosAtuais) =>
            jogosAtuais.filter((jogo) => jogo.id !== id)
        );
    }

    const jogosFiltrados = jogos.filter((jogo) =>
        jogo.nome.toLowerCase().includes(busca.toLowerCase())
    );

    return (
        <main className={styles.main}>
            <Sidebar />

            <div className={styles.conteudo}>
                {/* HEADER */}
                <header className={styles.header}>
                    <div className={styles.pesquisa}>
                        <Search size={20} />

                        <input
                            type="text"
                            placeholder="Pesquisar jogos..."
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                        />
                    </div>

                    <div className={styles.acoesHeader}>
                        <button
                            className={styles.botaoIcone}
                            aria-label="Notificações"
                        >
                            <Bell size={21} />
                        </button>

                        <Link
                            href="/perfil"
                            className={styles.perfilHeader}
                            aria-label="Meu perfil"
                        >
                            <User size={21} />
                        </Link>
                    </div>
                </header>

                {/* TÍTULO */}
                <section className={styles.titulo}>
                    <div>
                        <span className={styles.destaque}>
                            SUA BIBLIOTECA
                        </span>

                        <h1>
                            Meus Favoritos
                            <Heart size={25} fill="currentColor" />
                        </h1>

                        <p>
                            Todos os seus jogos preferidos em um só lugar.
                        </p>
                    </div>

                    <div className={styles.contador}>
                        <strong>
                            {jogos.length.toString().padStart(2, "0")}
                        </strong>
                        <span>Jogos salvos</span>
                    </div>
                </section>

                {/* LISTA DE FAVORITOS */}
                <section className={styles.secao}>
                    <div className={styles.secaoTitulo}>
                        <div>
                            <span className={styles.subtitulo}>
                                <Heart size={14} />
                                SELEÇÃO PESSOAL
                            </span>

                            <h2>Seus jogos favoritos</h2>
                        </div>

                        <span className={styles.quantidade}>
                            {jogosFiltrados.length} encontrados
                        </span>
                    </div>

                    {jogosFiltrados.length > 0 ? (
                        <div className={styles.lista}>
                            {jogosFiltrados.map((jogo) => (
                                <article
                                    className={styles.card}
                                    key={jogo.id}
                                >
                                    <div
                                        className={`${styles.capa} ${styles[jogo.cor]}`}
                                    >
                                        <span>{jogo.imagem}</span>

                                        <Heart
                                            className={styles.iconeCapa}
                                            size={20}
                                            fill="currentColor"
                                        />
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
                                                onClick={() =>
                                                    alert("Em breve!")
                                                }
                                            >
                                                <Gamepad2 size={17} />
                                                Jogar agora
                                            </button>

                                            <button
                                                className={styles.remover}
                                                onClick={() =>
                                                    removerFavorito(jogo.id)
                                                }
                                                title="Remover dos favoritos"
                                                aria-label={`Remover ${jogo.nome} dos favoritos`}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.vazio}>
                            <Heart size={45} />

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
                                <Link href="/catalogo">
                                    Explorar jogos
                                    <ArrowRight size={18} />
                                </Link>
                            )}
                        </div>
                    )}
                </section>

                <footer className={styles.footer}>
                    © 2026 IE2A Store — Todos os direitos reservados.
                </footer>
            </div>
        </main>
    );
}
