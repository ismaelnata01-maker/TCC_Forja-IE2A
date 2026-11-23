import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";
import { Home, Compass, Heart, Search, Filter } from "lucide-react";

// Lista com os 40 jogos (ou quantos você quiser colocar)
const todosOsJogos = [
    { id: 1, nome: "Cyberpunk 2077", imagem: "/jogos/cyberpunk.jpg", preco: "R$ 149,90", categoria: "RPG" },
    { id: 2, nome: "Red Dead Redemption 2", imagem: "/jogos/reddead.jpg", preco: "R$ 99,90", categoria: "Aventura" },
    { id: 3, nome: "Elden Ring", imagem: "/jogos/eldenring.jpg", preco: "R$ 199,90", categoria: "RPG" },
    { id: 4, nome: "Forza Horizon 5", imagem: "/jogos/forza.jpg", preco: "R$ 129,90", categoria: "Corrida" },
    { id: 5, nome: "Minecraft", imagem: "/jogos/minecraft.jpg", preco: "R$ 79,90", categoria: "Sandbox" },
    { id: 6, nome: "God of War Ragnarök", imagem: "/jogos/gow.jpg", preco: "R$ 249,90", categoria: "Ação" },
    // ... (você pode continuar adicionando os outros até 40 aqui)
];

export default function CatalogoPage() {
    return (
        <main className={styles.main}>

            {/* MENU LATERAL SIMPLIFICADO */}
            <aside className={styles.sidebar}>
                <div className={styles.logo}>
                    <h1>IE2A</h1>
                </div>
                <nav className={styles.navegacao}>
                    <Link href="/dashboard">
                        <Home size={20} /> <span>Início</span>
                    </Link>
                    <Link href="/catalogo" className={styles.ativo}>
                        <Compass size={20} /> <span>Catálogo</span>
                    </Link>
                    <Link href="/favoritos">
                        <Heart size={20} /> <span>Favoritos</span>
                    </Link>
                </nav>
            </aside>

            {/* CONTEÚDO DO CATÁLOGO */}
            <div className={styles.conteudo}>
                
                <header className={styles.headerCatalogo}>
                    <h1>Catálogo de Jogos</h1>
                    <p>Explore todos os {todosOsJogos.length} jogos disponíveis na plataforma.</p>
                </header>

                {/* GRID QUE GERA OS CARDS AUTOMATICAMENTE */}
                <div className={styles.listaJogos}>
                    {todosOsJogos.map((jogo) => (
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
                                <div className={styles.preco}>
                                    <span>{jogo.preco}</span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

            </div>
        </main>
    );
}