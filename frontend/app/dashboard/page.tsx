
"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import Sidebar from "@/componentes/sidebar";
import CardJogo from "@/componentes/CardJogo";

import {
    Search,
    Bell,
    User,
    ArrowRight,
    Flame,
    Tag,
} from "lucide-react";

const jogos = [
    {
        id: 1,
        nome: "Cyberpunk 2077",
        imagem: "/jogos/cyberpunk.jpg",
        categoria: "RPG / Mundo aberto",
        preco: "R$ 149,90",
        link: "https://store.steampowered.com/app/1091500/Cyberpunk_2077/",
    },
    {
        id: 2,
        nome: "Red Dead Redemption 2",
        imagem: "/jogos/reddead.jpg",
        categoria: "Ação / Aventura",
        preco: "R$ 199,90",
        link: "https://store.steampowered.com/app/1174180/Red_Dead_Redemption_2/",
    },
    {
        id: 3,
        nome: "Elden Ring",
        imagem: "/jogos/eldenring.jpg",
        categoria: "RPG / Fantasia",
        preco: "R$ 229,90",
        link: "https://store.steampowered.com/app/1245620/ELDEN_RING/",
    },
    {
        id: 4,
        nome: "Forza Horizon 5",
        imagem: "/jogos/forza.jpg",
        categoria: "Corrida",
        preco: "R$ 179,90",
        link: "https://store.steampowered.com/app/1551360/Forza_Horizon_5/",
    },
];

const promocoes = [
    {
        id: 1,
        nome: "Battlefield 2042",
        imagem: "/jogos/battlefield.jpg",
        precoAntigo: "R$ 249,90",
        preco: "R$ 74,90",
        desconto: "-70%",
        link: "https://store.steampowered.com/app/1517290/Battlefield_2042/",
    },
    {
        id: 2,
        nome: "Cyberpunk 2077",
        imagem: "/jogos/cyberpunk.jpg",
        precoAntigo: "R$ 199,90",
        preco: "R$ 99,90",
        desconto: "-50%",
        link: "https://store.steampowered.com/app/1091500/Cyberpunk_2077/",
    },
    {
        id: 3,
        nome: "Red Dead Redemption 2",
        imagem: "/jogos/reddead.jpg",
        precoAntigo: "R$ 299,90",
        preco: "R$ 149,90",
        desconto: "-50%",
        link: "https://store.steampowered.com/app/1174180/Red_Dead_Redemption_2/",
    },
];

const populares = [
    {
        id: 1,
        nome: "Grand Theft Auto V",
        imagem: "/jogos/gta.jpg",
        categoria: "Mundo aberto",
        link: "https://store.steampowered.com/app/271590/Grand_Theft_Auto_V/",
    },
    {
        id: 2,
        nome: "Fortnite",
        imagem: "/jogos/fortnite.jpg",
        categoria: "Battle Royale",
        link: "https://store.epicgames.com/p/fortnite",
    },
    {
        id: 3,
        nome: "God of War Ragnarök",
        imagem: "/jogos/godofwar.jpg",
        categoria: "Ação / Aventura",
        link: "https://store.steampowered.com/app/2322010/God_of_War_Ragnarok/",
    },
];

export default function Dashboard() {
    return (
        <main className={styles.main}>
            <Sidebar />

            <div className={styles.conteudo}>
                <header className={styles.header}>
                    <div className={styles.pesquisa}>
                        <Search size={20} />
                        <input
                            type="text"
                            placeholder="Pesquisar jogos..."
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
                            className={styles.perfil}
                            aria-label="Meu perfil"
                        >
                            <User size={21} />
                        </Link>
                    </div>
                </header>

                <section className={styles.banner}>
                    <div className={styles.bannerConteudo}>
                        <span className={styles.bannerTag}>
                            DESTAQUE DA SEMANA
                        </span>

                        <h1>
                            Sua próxima
                            <br />
                            grande aventura
                            <br />
                            começa aqui.
                        </h1>

                        <p>
                            Descubra novos mundos, encontre seus jogos
                            favoritos e aproveite ofertas especiais.
                        </p>

                        <Link href="/catalogo" className={styles.botaoBanner}>
                            Explorar jogos
                            <ArrowRight size={18} />
                        </Link>
                    </div>

                    <div className={styles.bannerImagem}>
                        <Image
                            src="/jogos/cyberpunk.jpg"
                            alt="Cyberpunk 2077"
                            fill
                            priority
                            sizes="(max-width: 750px) 100vw, 50vw"
                        />
                    </div>
                </section>

                {/* JOGOS EM DESTAQUE */}

                <section className={styles.secao}>
                    <div className={styles.tituloSecao}>
                        <div>
                            <span className={styles.subtitulo}>
                                ESCOLHAS PARA VOCÊ
                            </span>
                            <h2>Jogos em destaque</h2>
                        </div>

                        <Link href="/catalogo" className={styles.verTodos}>
                            Ver todos
                            <ArrowRight size={17} />
                        </Link>
                    </div>

                    <div className={styles.listaJogos}>
                        {jogos.map((jogo) => (
                            <CardJogo
                                key={jogo.id}
                                nome={jogo.nome}
                                imagem={jogo.imagem}
                                categoria={jogo.categoria}
                                preco={jogo.preco}
                                link={jogo.link}
                            />
                        ))}
                    </div>
                </section>

                {/* PROMOÇÕES */}

                <section className={styles.secao}>
                    <div className={styles.tituloSecao}>
                        <div>
                            <span className={styles.subtitulo}>
                                <Tag size={14} />
                                OFERTAS ESPECIAIS
                            </span>
                            <h2>Promoções imperdíveis</h2>
                        </div>

                        <Link href="/promocoes" className={styles.verTodos}>
                            Ver promoções
                            <ArrowRight size={17} />
                        </Link>
                    </div>

                    <div className={styles.listaJogos}>
                        {promocoes.map((jogo) => (
                            <CardJogo
                                key={jogo.id}
                                nome={jogo.nome}
                                imagem={jogo.imagem}
                                precoAntigo={jogo.precoAntigo}
                                preco={jogo.preco}
                                desconto={jogo.desconto}
                                link={jogo.link}
                            />
                        ))}
                    </div>
                </section>

                {/* MAIS POPULARES */}

                <section className={styles.secao}>
                    <div className={styles.tituloSecao}>
                        <div>
                            <span className={styles.subtitulo}>
                                <Flame size={14} />
                                EM ALTA
                            </span>
                            <h2>Mais populares</h2>
                        </div>

                        <Link href="/catalogo" className={styles.verTodos}>
                            Explorar catálogo
                            <ArrowRight size={17} />
                        </Link>
                    </div>

                    <div className={styles.listaJogos}>
                        {populares.map((jogo) => (
                            <CardJogo
                                key={jogo.id}
                                nome={jogo.nome}
                                imagem={jogo.imagem}
                                categoria={jogo.categoria}
                                avaliacao="Em alta na loja"
                                link={jogo.link}
                            />
                        ))}
                    </div>
                </section>

                <footer className={styles.footer}>
                    © 2026 IE2A Store — Todos os direitos reservados.
                </footer>
            </div>
        </main>
    );
}