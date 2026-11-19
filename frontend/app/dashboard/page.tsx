
import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";

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

            {/* Menu lateral */}
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

                    <Link href="/dashboard">Início</Link>
                    <Link href="/descobrir">Descobrir</Link>
                    <Link href="/categorias">Categorias</Link>
                    <Link href="/promocoes">Promoções</Link>
                    <Link href="/lancamentos">Lançamentos</Link>
                    <Link href="/favoritos">Favoritos</Link>
                </nav>

                <div className={styles.menuInferior}>
                    <Link href="/perfil">Meu perfil</Link>
                    <Link href="/configuracoes">Configurações</Link>
                </div>

            </aside>

            {/* Conteúdo principal */}
            <div className={styles.conteudo}>

                {/* Cabeçalho */}
                <header className={styles.header}>
                    <input
                        type="text"
                        placeholder="Pesquisar jogos..."
                    />

                    <Link href="/perfil" className={styles.perfil}>
                        Meu perfil
                    </Link>
                </header>

                {/* Banner */}
                <section className={styles.banner}>
                    <div>
                        <p>DESTAQUE DA SEMANA</p>
                        <h2>Descubra seu próximo jogo favorito</h2>
                        <span>
                            Explore novos mundos, aventuras e desafios.
                        </span>
                        <Link href="/descobrir">
                            Explorar jogos
                        </Link>
                    </div>
                </section>

                {/* Jogos em destaque */}
                <section className={styles.secao}>
                    <h2>Jogos em destaque</h2>

                    <div className={styles.listaJogos}>
                        {jogos.map((jogo) => (
                            <article className={styles.cardJogo} key={jogo.id}>
                                <div className={styles.imagemJogo}>
                                    <Image
                                        src={jogo.imagem}
                                        alt={jogo.nome}
                                        fill
                                        sizes="(max-width: 700px) 80vw, 250px"
                                    />
                                </div>

                                <div className={styles.infoJogo}>
                                    <p>{jogo.categoria}</p>
                                    <h3>{jogo.nome}</h3>
                                    <span>{jogo.preco}</span>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                {/* Promoções */}
                <section className={styles.secao}>
                    <h2>Promoções</h2>
                    <p>Confira os jogos com descontos especiais.</p>
                </section>

                {/* Mais populares */}
                <section className={styles.secao}>
                    <h2>Mais populares</h2>
                    <p>Os jogos que estão fazendo sucesso.</p>
                </section>

            </div>
        </main>
    );
}
