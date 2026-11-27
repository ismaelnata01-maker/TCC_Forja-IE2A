"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Sidebar from "@/componentes/sidebar";
import { Search, Heart, ArrowRight } from "lucide-react";
import styles from "./page.module.css";

type Jogo = {
    id: number;
    titulo: string;
    genero: string;
    imagemUrl: string | null;
    preco: number;
};

type Desejo = {
    jogoId: number;
    jogo: Jogo;
};

function formatarPreco(preco: number) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(preco);
}

async function lerErro(response: Response, mensagemPadrao: string) {
    const texto = await response.text();
    try {
        const mensagem: unknown = JSON.parse(texto);
        return typeof mensagem === "string" ? mensagem : mensagemPadrao;
    } catch {
        return texto || mensagemPadrao;
    }
}

export default function FavoritosPage() {
    const [jogos, setJogos] = useState<Desejo[]>([]);
    const [busca, setBusca] = useState("");
    const [carregando, setCarregando] = useState(true);
    const [removendo, setRemovendo] = useState<number | null>(null);
    const [erro, setErro] = useState("");

    useEffect(() => {
        let ativo = true;

        async function carregarDesejos() {
            try {
                const response = await fetch("/api/desejos");
                if (!response.ok) {
                    if (response.status === 401) {
                        throw new Error("Faça login para acessar sua lista de desejos.");
                    }
                    throw new Error(await lerErro(response, "Não foi possível carregar sua lista de desejos."));
                }

                const desejos: Desejo[] = await response.json();
                if (ativo) setJogos(desejos);
            } catch (e) {
                if (ativo) {
                    setErro(e instanceof Error ? e.message : "Não foi possível conectar ao servidor.");
                }
            } finally {
                if (ativo) setCarregando(false);
            }
        }

        void carregarDesejos();
        return () => {
            ativo = false;
        };
    }, []);

    async function removerFavorito(jogoId: number) {
        setRemovendo(jogoId);
        setErro("");

        try {
            const response = await fetch(`/api/desejos/${jogoId}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error("Faça login novamente para alterar sua lista de desejos.");
                }
                throw new Error(await lerErro(response, "Não foi possível remover este jogo."));
            }

            setJogos((atuais) => atuais.filter((item) => item.jogoId !== jogoId));
        } catch (e) {
            setErro(e instanceof Error ? e.message : "Não foi possível conectar ao servidor.");
        } finally {
            setRemovendo(null);
        }
    }

    const jogosFiltrados = jogos.filter((item) =>
        `${item.jogo.titulo} ${item.jogo.genero}`.toLowerCase().includes(busca.toLowerCase())
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
                        <span className={styles.destaque}>SUA LISTA DE DESEJOS</span>

                        <h1>
                            Meus Favoritos
                            <Heart size={25} fill="currentColor" />
                        </h1>

                        <p>Todos os jogos que você escolheu guardar.</p>
                    </div>

                    <div className={styles.contador}>
                        <strong>{jogos.length.toString().padStart(2, "0")}</strong>
                        <span>Jogos salvos</span>
                    </div>
                </section>

                {erro && (carregando || jogos.length > 0) && (
                    <p role="alert">
                        {erro}{" "}
                        {erro.toLowerCase().includes("login") && <Link href="/">Fazer login</Link>}
                    </p>
                )}

                <section className={styles.secao}>
                    <div className={styles.secaoTitulo}>
                        <h2>Seus jogos favoritos</h2>
                        <span>{jogosFiltrados.length} encontrados</span>
                    </div>

                    {carregando ? (
                        <div className={styles.vazio}>
                            <p>Carregando sua lista de desejos...</p>
                        </div>
                    ) : erro && jogos.length === 0 ? (
                        <div className={styles.vazio} role="alert">
                            <Heart size={45} />
                            <h3>Não foi possível carregar sua lista</h3>
                            <p>{erro}</p>
                            {erro.toLowerCase().includes("login") && (
                                <Link href="/">Fazer login</Link>
                            )}
                        </div>
                    ) : jogosFiltrados.length > 0 ? (
                        <div className={styles.lista}>
                            {jogosFiltrados.map((item) => (
                                <article className={styles.card} key={item.jogoId}>
                                    <div className={styles.imagemJogo}>
                                        <Image
                                            src={item.jogo.imagemUrl || "/jogos/cyberpunk.jpg"}
                                            alt={item.jogo.titulo}
                                            fill
                                            unoptimized
                                            sizes="(max-width: 700px) 80vw, 250px"
                                        />

                                        <button
                                            type="button"
                                            className={styles.remover}
                                            onClick={() => void removerFavorito(item.jogoId)}
                                            disabled={removendo !== null}
                                            aria-label={`Remover ${item.jogo.titulo} dos favoritos`}
                                            title="Remover dos favoritos"
                                        >
                                            <Heart size={19} fill="currentColor" />
                                        </button>
                                    </div>

                                    <div className={styles.info}>
                                        <p>{item.jogo.genero}</p>
                                        <h3>{item.jogo.titulo}</h3>
                                        <strong>{formatarPreco(item.jogo.preco)}</strong>
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
                                    : "Tente pesquisar por outro nome ou gênero."}
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
