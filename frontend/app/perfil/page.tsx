
"use client";

import Link from "next/link";
import styles from "./page.module.css";

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

const jogos = [
    { nome: "Cyberpunk 2077", categoria: "RPG", sigla: "CP" },
    { nome: "Red Dead Redemption 2", categoria: "Aventura", sigla: "RDR2" },
    { nome: "Elden Ring", categoria: "Ação / RPG", sigla: "ER" },
];

export default function Perfil() {
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

                <span className={styles.usuarioHeader}>Minha conta</span>
            </header>

            <section className={styles.conteudo}>
                <div className={styles.tituloPagina}>
                    <div>
                        <span>ÁREA DO CLIENTE</span>
                        <h1>Meu perfil</h1>
                        <p>Gerencie seus dados, compras e jogos adquiridos.</p>
                    </div>
                </div>

                <section className={styles.perfilCard}>
                    <div className={styles.avatar}>AG</div>

                    <div className={styles.dadosUsuario}>
                        <span>CLIENTE IE2A</span>
                        <h2>Antony Guilherme</h2>
                        <p>antony@email.com</p>
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

                        <span className={styles.quantidade}>03 jogos</span>
                    </div>

                    <div className={styles.jogosGrid}>
                        {jogos.map((jogo, index) => (
                            <article className={styles.jogoCard} key={index}>
                                <div className={`${styles.capaJogo} ${styles[`capa${index + 1}`]}`}>
                                    {jogo.sigla}
                                </div>

                                <div className={styles.infoJogo}>
                                    <h3>{jogo.nome}</h3>
                                    <p>{jogo.categoria}</p>
                                    <span>Comprado</span>
                                </div>
                            </article>
                        ))}
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
