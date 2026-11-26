
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Sidebar from "@/componentes/sidebar";
import { Search, Heart, Trash2, ArrowRight } from "lucide-react";
import styles from "./page.module.css";

type Jogo = {
    id: number;
    nome: string;
    imagem: string;
    preco: string;
    categoria: string;
};

export default function FavoritosPage() {
    const [jogos, setJogos] = useState<Jogo[]>([]);
    const [busca, setBusca] = useState("");

    // Busca os jogos salvos no navegador
    useEffect(() => {
        const salvos = localStorage.getItem("jogosFavoritos");

        if (salvos) {
            try {
                setJogos(JSON.parse(salvos));
            } catch {
                setJogos([]);
            }
        }
    }, []);

    // Remove um jogo dos favoritos
    function removerFavorito(id: number) {
        const atualizados = jogos.filter((jogo) => jogo.id !== id);

        setJogos(atualizados);
        localStorage.setItem("jogosFavoritos", JSON.stringify(atualizados));
    }

    // Filtra os jogos pela pesquisa
    const jogosFiltrados = jogos.filter((jogo) =>
        jogo.nome.toLowerCase().includes(busca.toLowerCase())
    );

    return (
        <main className={styles.main}>
            <Sidebar />

            <div className={styles.conteudo}>
                <header className={styles.header}>
                    <div className={styles.pesquisa}>
                        <Search size={19} />

                        <input
                            type="text"
                            placeholder="Pesquisar favoritos..."
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                        />
                    </div>
                </header>

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
                            Todos os jogos que você escolheu guardar.
                        </p>
                    </div>

                    <div className={styles.contador}>
                        <strong>{jogos.length.toString().padStart(2, "0")}</strong>
                        <span>Jogos salvos</span>
                    </div>
                </section>

                <section className={styles.secao}>
                    <div className={styles.secaoTitulo}>
                        <h2>Seus jogos favoritos</h2>
                        <span>{jogosFiltrados.length} encontrados</span>
                    </div>

                    {jogosFiltrados.length > 0 ? (
                        <div className={styles.lista}>
                            {jogosFiltrados.map((jogo) => (
                                <article className={styles.card} key={jogo.id}>
                                    <div className={styles.imagemJogo}>
                                        <Image
                                            src={jogo.imagem}
                                            alt={jogo.nome}
                                            fill
                                            sizes="(max-width: 700px) 80vw, 250px"
                                        />

                                        <button
                                            className={styles.remover}
                                            onClick={() => removerFavorito(jogo.id)}
                                            aria-label={`Remover ${jogo.nome} dos favoritos`}
                                            title="Remover dos favoritos"
                                        >
                                            <Heart size={19} fill="currentColor" />
                                        </button>
                                    </div>

                                    <div className={styles.info}>
                                        <p>{jogo.categoria}</p>
                                        <h3>{jogo.nome}</h3>
                                        <strong>{jogo.preco}</strong>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.vazio}>
                            <Heart size={45} />

                            <h3>
                                {jogos.length === 0
                                    ? "Sua lista está vazia"
                                    : "Nenhum jogo encontrado"}
                            </h3>

                            <p>
                                {jogos.length === 0
                                    ? "Explore o catálogo e favorite seus jogos preferidos."
                                    : "Tente pesquisar por outro nome."}
                            </p>

                            {jogos.length === 0 && (
                                <Link href="/catalogo">
                                    Explorar catálogo
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
