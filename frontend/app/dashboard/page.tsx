
import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";

import {
    Home,
    Compass,
    Gamepad2,
    Tag,
    Trophy,
    Heart,
    User,
    Settings,
    LogOut,
    Search,
    Bell,
    Flame,
    Sparkles
} from "lucide-react";

const jogos = [
    {
        id: 1,
        nome: "Cyberpunk 2077",
        imagem: "/jogos/cyberpunk.jpg",
        preco: "R$ 149,90",
        categoria: "RPG"
    },
    {
        id: 2,
        nome: "Red Dead Redemption 2",
        imagem: "/jogos/reddead.jpg",
        preco: "R$ 99,90",
        categoria: "Aventura"
    },
    {
        id: 3,
        nome: "Elden Ring",
        imagem: "/jogos/eldenring.jpg",
        preco: "R$ 199,90",
        categoria: "RPG"
    },
    {
        id: 4,
        nome: "Forza Horizon 5",
        imagem: "/jogos/forza.jpg",
        preco: "R$ 129,90",
        categoria: "Corrida"
    }
];

export default function DashboardPage() {
    return (
        <main className={styles.main}>

            {/* MENU LATERAL */}
            <aside className={styles.sidebar}>

                <div className={styles.logo}>
                    <Image
                        src="/logo.png"
                        alt="Logo IE2A"
                        width={65}
                        height={65}
                    />
                    <h1>IE2A</h1>
                </div>

                <nav className={styles.navegacao}>

                    <p className={styles.tituloMenu}>MENU</p>

                    <Link href="/dashboard" className={styles.ativo}>
                        <Home size={20} />
                        <span>Início</span>
                    </Link>

                    <Link href="/catalogo">
                        <Compass size={20} />
                        <span>Catálogo</span>
                    </Link>

                    <Link href="/favoritos">
                        <Heart size={20} />
                        <span>Favoritos</span>
                    </Link>

                </nav>

                <div className={styles.menuInferior}>

                    <p className={styles.tituloMenu}>PESSOAL</p>

                    <Link href="/perfil">
                        <User size={20} />
                        <span>Meu perfil</span>
                    </Link>

                    <Link href="/configuracoes">
                        <Settings size={20} />
                        <span>Configurações</span>
                    </Link>

                    <Link href="/login">
                        <LogOut size={20} />
                        <span>Sair</span>
                    </Link>

                </div>

            </aside>

            {/* CONTEÚDO PRINCIPAL */}
            <div className={styles.conteudo}>

                {/* CABEÇALHO */}
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

                {/* BANNER */}
                <section className={styles.banner}>

                    <div className={styles.bannerConteudo}>

                        <p className={styles.bannerEtiqueta}>
                            <Sparkles size={16} />
                            DESTAQUE DA SEMANA
                        </p>

                        <h2>
                            Descubra seu próximo jogo favorito
                        </h2>

                        <span>
                            Explore novos mundos, aventuras e desafios.
                        </span>

                        <Link href="/descobrir">
                            Explorar jogos
                            <Compass size={18} />
                        </Link>

                    </div>

                </section>

                {/* JOGOS EM DESTAQUE */}
                <section className={styles.secao}>

                    <div className={styles.tituloSecao}>
                        <h2>Jogos em destaque</h2>
                        <Link href="/descobrir">
                            Ver todos
                            <ChevronRightFallback />
                        </Link>
                    </div>

                    <div className={styles.listaJogos}>

                        {jogos.map((jogo) => (
                            <article
                                className={styles.cardJogo}
                                key={jogo.id}
                            >

                                <div className={styles.imagemJogo}>
                                    <Image
                                        src={jogo.imagem}
                                        alt={jogo.nome}
                                        fill
                                        sizes="(max-width: 700px) 80vw, 250px"
                                    />

                                    <button
                                        className={styles.favorito}
                                        aria-label={`Favoritar ${jogo.nome}`}
                                    >
                                        <Heart size={19} />
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
                        ))}

                    </div>

                </section>

                {/* PROMOÇÕES */}
                <section className={styles.secao}>

                    <div className={styles.tituloSecao}>
                        <h2>
                            <Tag size={21} />
                            Promoções
                        </h2>
                        <Link href="/promocoes">
                            Ver todos
                            <ChevronRightFallback />
                        </Link>
                    </div>

                    <div className={styles.avisoSecao}>
                        <Flame size={25} />
                        <p>Confira em breve os jogos com descontos especiais.</p>
                    </div>

                </section>

                {/* MAIS POPULARES */}
                <section className={styles.secao}>

                    <div className={styles.tituloSecao}>
                        <h2>
                            <Flame size={21} />
                            Mais populares
                        </h2>
                    </div>

                    <div className={styles.avisoSecao}>
                        <Gamepad2 size={25} />
                        <p>Os jogos mais populares estarão aqui.</p>
                    </div>

                </section>

            </div>

        </main>
    );
}

function ChevronRightFallback() {
    return <span aria-hidden="true">→</span>;
}
    