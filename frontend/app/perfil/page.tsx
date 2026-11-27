
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

type Usuario = {
    id: number;
    nome: string;
    email: string;
};

type StatusBiblioteca = "NAO_INICIADO" | "EM_ANDAMENTO" | "CONCLUIDO";

type ItemBiblioteca = {
    jogoId: number;
    status: StatusBiblioteca;
    jogo: {
        titulo: string;
        genero: string;
    };
};

const pedidos = [
    {
        id: "#IE2026001",
        jogo: "Cyberpunk 2077",
        data: "12/11/2026",
        preco: "R$ 89,90",
        status: "Concluído",
    },
    {
        id: "#IE2026002",
        jogo: "Red Dead Redemption 2",
        data: "15/11/2026",
        preco: "R$ 99,90",
        status: "Concluído",
    },
    {
        id: "#IE2026003",
        jogo: "Elden Ring",
        data: "18/11/2026",
        preco: "R$ 149,90",
        status: "Processando",
    },
];

const statusBiblioteca: Record<StatusBiblioteca, string> = {
    NAO_INICIADO: "Não iniciado",
    EM_ANDAMENTO: "Em andamento",
    CONCLUIDO: "Concluído",
};

export default function Perfil() {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [jogos, setJogos] = useState<ItemBiblioteca[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        let ativo = true;

        async function carregarDados() {
            try {
                const [perfilResponse, bibliotecaResponse] = await Promise.all([
                    fetch("/api/me"),
                    fetch("/api/biblioteca"),
                ]);

                if (!perfilResponse.ok) {
                    const mensagem = await perfilResponse.text();
                    throw new Error(mensagem.replace(/^"|"$/g, "") || "Não foi possível carregar o perfil.");
                }
                if (!bibliotecaResponse.ok) {
                    const mensagem = await bibliotecaResponse.text();
                    throw new Error(mensagem.replace(/^"|"$/g, "") || "Não foi possível carregar a biblioteca.");
                }

                const perfil: Usuario = await perfilResponse.json();
                const biblioteca: ItemBiblioteca[] = await bibliotecaResponse.json();

                if (ativo) {
                    setUsuario(perfil);
                    setJogos(biblioteca);
                }
            } catch (e) {
                if (ativo) {
                    setErro(e instanceof Error ? e.message : "Não foi possível conectar ao servidor.");
                }
            } finally {
                if (ativo) setCarregando(false);
            }
        }

        void carregarDados();
        return () => {
            ativo = false;
        };
    }, []);

    const iniciais = usuario?.nome
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((parte) => parte[0])
        .join("")
        .toUpperCase() ?? "?";

    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <Link href="/" className={styles.logo}>
                    IE<span>2A</span>
                </Link>

                <nav>
                    <Link href="/">Início</Link>
                    <Link href="/promocoes">Promoções</Link>
                    <Link href="/favoritos">Favoritos</Link>
                </nav>

                <span className={styles.usuarioHeader}>{usuario?.nome ?? "Minha conta"}</span>
            </header>

            <section className={styles.conteudo}>
                <div className={styles.tituloPagina}>
                    <div>
                        <span>ÁREA DO CLIENTE</span>
                        <h1>Meu perfil</h1>
                        <p>Gerencie seus dados, compras e jogos adquiridos.</p>
                    </div>
                </div>

                {erro && <p role="alert">{erro}</p>}
                {carregando && <p>Carregando dados do perfil...</p>}

                <section className={styles.perfilCard}>
                    <div className={styles.avatar}>{iniciais}</div>

                    <div className={styles.dadosUsuario}>
                        <span>CLIENTE IE2A</span>
                        <h2>{usuario?.nome ?? "Perfil indisponível"}</h2>
                        <p>{usuario?.email ?? ""}</p>
                    </div>

                    <button
                        className={styles.botaoEditar}
                        onClick={() => alert("Em breve: editar perfil")}
                    >
                        Editar perfil
                    </button>
                </section>

                <section className={styles.secao}>
                    <div className={styles.secaoTitulo}>
                        <div>
                            <span>SUAS AQUISIÇÕES</span>
                            <h2>Minha biblioteca</h2>
                        </div>

                        <span className={styles.quantidade}>{jogos.length} jogos</span>
                    </div>

                    <div className={styles.jogosGrid}>
                        {jogos.map((item, index) => (
                            <article className={styles.jogoCard} key={item.jogoId}>
                                <div className={`${styles.capaJogo} ${styles[`capa${(index % 3) + 1}`]}`}>
                                    {item.jogo.titulo
                                        .split(/\s+/)
                                        .map((parte) => parte[0])
                                        .join("")
                                        .slice(0, 4)
                                        .toUpperCase()}
                                </div>

                                <div className={styles.infoJogo}>
                                    <h3>{item.jogo.titulo}</h3>
                                    <p>{item.jogo.genero}</p>
                                    <span>{statusBiblioteca[item.status]}</span>
                                </div>
                            </article>
                        ))}
                        {!carregando && !erro && jogos.length === 0 && (
                            <p>Sua biblioteca ainda está vazia.</p>
                        )}
                    </div>
                </section>

                <section className={styles.secao}>
                    <div className={styles.secaoTitulo}>
                        <div>
                            <span>HISTÓRICO DA LOJA</span>
                            <h2>Meus pedidos</h2>
                        </div>
                    </div>

                    <div className={styles.pedidosContainer}>
                        {pedidos.map((pedido) => (
                            <article className={styles.pedido} key={pedido.id}>
                                <div className={styles.pedidoInfo}>
                                    <span className={styles.pedidoId}>{pedido.id}</span>
                                    <h3>{pedido.jogo}</h3>
                                    <p>{pedido.data}</p>
                                </div>

                                <div className={styles.pedidoFinal}>
                                    <strong>{pedido.preco}</strong>
                                    <span
                                        className={
                                            pedido.status === "Concluído"
                                                ? styles.concluido
                                                : styles.processando
                                        }
                                    >
                                        {pedido.status}
                                    </span>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <section className={styles.atalhos}>
                    <Link href="/favoritos">
                        <span>♡</span>
                        <div>
                            <h3>Meus favoritos</h3>
                            <p>Veja os jogos que você salvou.</p>
                        </div>
                        <strong>→</strong>
                    </Link>

                    <Link href="/promocoes">
                        <span>％</span>
                        <div>
                            <h3>Ofertas disponíveis</h3>
                            <p>Encontre novos jogos com desconto.</p>
                        </div>
                        <strong>→</strong>
                    </Link>
                </section>
            </section>

            <footer className={styles.footer}>
                © 2026 IE2A Store — Todos os direitos reservados.
            </footer>
        </main>
    );
}
