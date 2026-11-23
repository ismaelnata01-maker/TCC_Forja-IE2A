"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

const atalhos = [
    { titulo: "Descobrir", descricao: "Novos jogos em destaque", valor: "48", classe: "descobrir", simbolo: "⌂" },
    { titulo: "Catálogo", descricao: "Explore todos os jogos", valor: "320", classe: "catalogo", simbolo: "▦" },
    { titulo: "Lista de desejos", descricao: "Jogos aguardando compra", valor: "12", classe: "desejos", simbolo: "♡" },
    { titulo: "Minha biblioteca", descricao: "Jogos adicionados", valor: "86", classe: "biblioteca", simbolo: "▥" },
];

export default function DashboardPage() {
    const router = useRouter();
    const [secao, setSecao] = useState("Descobrir");
    const [usuario, setUsuario] = useState<{ nome: string } | null>(null);

    useEffect(() => {
        fetch("/api/me")
            .then(async (response) => {
                if (!response.ok) {
                    router.replace("/");
                    return null;
                }
                return response.json();
            })
            .then((dados) => {
                if (dados) setUsuario(dados);
            })
            .catch(() => router.replace("/"));
    }, [router]);

    async function sair() {
        await fetch("/api/logout", { method: "POST" });
        router.replace("/");
        router.refresh();
    }

    return (
        <div className={styles.shell}>
            <aside className={styles.sidebar}>
                <div className={styles.brand}>
                    <span className={styles.brandMark}>I</span>
                    <strong>IE2A</strong>
                </div>

                <nav className={styles.nav} aria-label="Menu principal">
                    {[
                        ["Descobrir", "⌂"],
                        ["Catálogo", "▦"],
                        ["Lista de desejos", "♡"],
                        ["Minha biblioteca", "▥"],
                    ].map(([nome, simbolo]) => (
                        <button
                            type="button"
                            className={secao === nome ? styles.active : ""}
                            onClick={() => setSecao(nome)}
                            key={nome}
                        >
                            <span>{simbolo}</span> {nome}
                        </button>
                    ))}
                </nav>

                <button className={styles.sair} type="button" onClick={sair}><span>↪</span> Sair</button>
            </aside>

            <main className={styles.main}>
                <header className={styles.header}>
                    <div>
                        <p className={styles.data}>Segunda-feira, 23 de novembro</p>
                        <h1>Olá, jogador!</h1>
                    </div>
                    <div className={styles.usuario}>
                        <div>
                            <strong>{usuario?.nome || "Jogador"}</strong>
                            <span>Jogadora</span>
                        </div>
                        <div className={styles.avatar}>A</div>
                    </div>
                </header>

                <section className={styles.conteudo}>
                    <div className={styles.tituloSecao}>
                        <div>
                            <span>Seu universo</span>
                            <h2>{secao}</h2>
                        </div>
                        <button type="button">+ Adicionar jogo</button>
                    </div>

                    <div className={styles.cards}>
                        {atalhos.map((item) => (
                            <article className={`${styles.card} ${styles[item.classe]}`} key={item.titulo}>
                                <div className={styles.cardTopo}>
                                    <div className={styles.icone}>{item.simbolo}</div>
                                    <span className={styles.status}>Ativo</span>
                                </div>
                                <strong className={styles.valor}>{item.valor}</strong>
                                <h3>{item.titulo}</h3>
                                <p>{item.descricao}</p>
                                <a href="#">Acessar módulo <span>→</span></a>
                            </article>
                        ))}
                    </div>

                    <div className={styles.grade}>
                        <section className={styles.painel}>
                            <div className={styles.painelTitulo}>
                                <h3>Jogados recentemente</h3>
                                <button type="button">Ver tudo</button>
                            </div>
                            <div className={styles.lista}>
                                {[
                                    ["The Last Chronicle", "Aventura", "Há 20 min"],
                                    ["Neon Speedway", "Corrida", "Hoje"],
                                    ["Shadow Arena", "Ação", "Ontem"],
                                ].map(([jogo, genero, tempo]) => (
                                    <div className={styles.item} key={jogo}>
                                        <div className={styles.miniAvatar}>{jogo.charAt(0)}</div>
                                        <div><strong>{jogo}</strong><span>{genero}</span></div>
                                        <time>{tempo}</time>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className={styles.painel}>
                            <div className={styles.painelTitulo}>
                                <h3>Seu progresso</h3>
                                <span>Novembro</span>
                            </div>
                            <div className={styles.resumo}>
                                <div><strong>18h</strong><span>Jogadas este mês</span></div>
                                <div><strong>7</strong><span>Conquistas novas</span></div>
                            </div>
                        </section>
                    </div>
                </section>
            </main>
        </div>
    );
}