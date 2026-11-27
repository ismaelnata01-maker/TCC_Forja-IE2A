"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Sidebar from "@/componentes/sidebar";
import { Heart } from "lucide-react";
import styles from "./page.module.css";

type Jogo = {
    id: number;
    titulo: string;
    descricao: string;
    genero: string;
    plataforma: string;
    imagemUrl: string | null;
    anoLancamento: number | null;
    preco: number;
};

type Desejo = {
    jogoId: number;
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

export default function CatalogoPage() {
    const [jogos, setJogos] = useState<Jogo[]>([]);
    const [favoritos, setFavoritos] = useState<Set<number>>(new Set());
    const [carregando, setCarregando] = useState(true);
    const [carregandoDesejos, setCarregandoDesejos] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");
    const [mensagem, setMensagem] = useState("");

    useEffect(() => {
        let ativo = true;

        async function carregarJogos() {
            try {
                const response = await fetch("/api/jogos");
                if (!response.ok) {
                    throw new Error(await lerErro(response, "Não foi possível carregar o catálogo."));
                }
                const dados: Jogo[] = await response.json();
                if (ativo) setJogos(dados);
            } catch (e) {
                if (ativo) {
                    setErro(e instanceof Error ? e.message : "Não foi possível conectar ao servidor.");
                }
            } finally {
                if (ativo) setCarregando(false);
            }
        }

        async function carregarDesejos() {
            try {
                const response = await fetch("/api/desejos");
                if (!response.ok) {
                    if (response.status === 401) {
                        throw new Error("Entre na sua conta para usar a lista de desejos.");
                    }
                    throw new Error(await lerErro(response, "Não foi possível carregar seus favoritos."));
                }
                const desejos: Desejo[] = await response.json();
                if (ativo) setFavoritos(new Set(desejos.map((desejo) => desejo.jogoId)));
            } catch (e) {
                if (ativo) {
                    setMensagem(e instanceof Error ? e.message : "Não foi possível carregar seus favoritos.");
                }
            } finally {
                if (ativo) setCarregandoDesejos(false);
            }
        }

        void carregarJogos();
        void carregarDesejos();
        return () => {
            ativo = false;
        };
    }, []);

    async function alternarFavorito(jogoId: number) {
        const removendo = favoritos.has(jogoId);
        setSalvando(true);
        setErro("");
        setMensagem("");

        try {
            const response = await fetch(`/api/desejos/${jogoId}`, {
                method: removendo ? "DELETE" : "POST",
            });
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error("Faça login para adicionar jogos à sua lista de desejos.");
                }
                throw new Error(await lerErro(response, "Não foi possível atualizar sua lista de desejos."));
            }

            setFavoritos((atuais) => {
                const atualizados = new Set(atuais);
                if (removendo) {
                    atualizados.delete(jogoId);
                } else {
                    atualizados.add(jogoId);
                }
                return atualizados;
            });
            setMensagem(removendo ? "Jogo removido da lista de desejos." : "Jogo adicionado à lista de desejos.");
        } catch (e) {
            setErro(e instanceof Error ? e.message : "Não foi possível conectar ao servidor.");
        } finally {
            setSalvando(false);
        }
    }

    return (
        <main className={styles.main}>
            <Sidebar />

            <div className={styles.conteudo}>
                <header className={styles.headerCatalogo}>
                    <h1>Catálogo de Jogos</h1>
                    <p>Explore todos os {jogos.length} jogos disponíveis na plataforma.</p>
                </header>

                {erro && <p role="alert">{erro}</p>}
                {mensagem && (
                    <p role="status">
                        {mensagem}{" "}
                        {mensagem.includes("login") || mensagem.includes("conta") ? (
                            <Link href="/">Fazer login</Link>
                        ) : null}
                    </p>
                )}
                {carregando && <p>Carregando catálogo...</p>}

                {!carregando && !erro && jogos.length === 0 && (
                    <p>Nenhum jogo cadastrado no catálogo.</p>
                )}

                <div className={styles.listaJogos}>
                    {jogos.map((jogo) => {
                        const favoritado = favoritos.has(jogo.id);
                        const imagem = jogo.imagemUrl || "/jogos/cyberpunk.jpg";

                        return (
                            <article className={styles.cardJogo} key={jogo.id}>
                                <div className={styles.imagemJogo}>
                                    <Image
                                        src={imagem}
                                        alt={jogo.titulo}
                                        fill
                                        unoptimized
                                        sizes="(max-width: 700px) 80vw, 250px"
                                    />

                                    <button
                                        type="button"
                                        className={`${styles.botaoFavorito} ${
                                            favoritado ? styles.favoritado : ""
                                        }`}
                                        onClick={() => void alternarFavorito(jogo.id)}
                                        disabled={salvando || carregandoDesejos}
                                        aria-label={
                                            favoritado
                                                ? `Remover ${jogo.titulo} dos favoritos`
                                                : `Adicionar ${jogo.titulo} aos favoritos`
                                        }
                                        aria-pressed={favoritado}
                                    >
                                        <Heart
                                            size={19}
                                            fill={favoritado ? "currentColor" : "none"}
                                        />
                                    </button>
                                </div>

                                <div className={styles.infoJogo}>
                                    <p>{jogo.genero} · {jogo.plataforma}</p>
                                    <h3>{jogo.titulo}</h3>
                                    <div className={styles.preco}>
                                        <span>{formatarPreco(jogo.preco)}</span>
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
