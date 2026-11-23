
"use client";

import { useState } from "react";
import styles from "./page.module.css";

const jogosIniciais = [
    {
        id: 1,
        nome: "Battlefield 2042",
        categoria: "FPS",
        descricao: "Entre em batalhas intensas e participe de guerras em larga escala.",
        precoAntigo: 249.90,
        precoAtual: 49.90,
        desconto: 80,
        cor: "battlefield",
        capa: "BATTLEFIELD",
        destaque: true,
    },
    {
        id: 2,
        nome: "Cyberpunk 2077",
        categoria: "RPG",
        descricao: "Explore Night City em um mundo futurista cheio de perigos.",
        precoAntigo: 199.90,
        precoAtual: 79.90,
        desconto: 60,
        cor: "cyberpunk",
        capa: "CYBERPUNK 2077",
        destaque: true,
    },
    {
        id: 3,
        nome: "Red Dead Redemption 2",
        categoria: "Aventura",
        descricao: "Viva uma jornada emocionante pelo Velho Oeste.",
        precoAntigo: 299.90,
        precoAtual: 89.90,
        desconto: 70,
        cor: "reddead",
        capa: "RED DEAD",
        destaque: true,
    },
    {
        id: 4,
        nome: "Grand Theft Auto V",
        categoria: "Ação",
        descricao: "Explore Los Santos e descubra tudo o que a cidade oferece.",
        precoAntigo: 149.90,
        precoAtual: 37.90,
        desconto: 75,
        cor: "gta",
        capa: "GRAND THEFT AUTO V",
        destaque: false,
    },
    {
        id: 5,
        nome: "Elden Ring",
        categoria: "RPG",
        descricao: "Descubra um mundo fantástico repleto de desafios e mistérios.",
        precoAntigo: 249.90,
        precoAtual: 149.90,
        desconto: 40,
        cor: "elden",
        capa: "ELDEN RING",
        destaque: true,
    },
    {
        id: 6,
        nome: "Forza Horizon 5",
        categoria: "Corrida",
        descricao: "Explore paisagens incríveis e participe de corridas emocionantes.",
        precoAntigo: 249.90,
        precoAtual: 99.90,
        desconto: 60,
        cor: "forza",
        capa: "FORZA HORIZON 5",
        destaque: false,
    },
    {
        id: 7,
        nome: "God of War Ragnarök",
        categoria: "Ação",
        descricao: "Acompanhe Kratos e Atreus em uma aventura pela mitologia nórdica.",
        precoAntigo: 249.90,
        precoAtual: 174.90,
        desconto: 30,
        cor: "god",
        capa: "GOD OF WAR",
        destaque: false,
    },
    {
        id: 8,
        nome: "Hogwarts Legacy",
        categoria: "Aventura",
        descricao: "Descubra o mundo mágico de Hogwarts e crie sua própria história.",
        precoAntigo: 199.90,
        precoAtual: 59.90,
        desconto: 70,
        cor: "hogwarts",
        capa: "HOGWARTS",
        destaque: false,
    },
    {
        id: 9,
        nome: "The Witcher 3",
        categoria: "RPG",
        descricao: "Viaje por um mundo de fantasia na pele do bruxo Geralt.",
        precoAntigo: 129.90,
        precoAtual: 25.90,
        desconto: 80,
        cor: "witcher",
        capa: "THE WITCHER",
        destaque: false,
    },
    {
        id: 10,
        nome: "Resident Evil 4",
        categoria: "Terror",
        descricao: "Enfrente criaturas assustadoras em uma missão de sobrevivência.",
        precoAntigo: 199.90,
        precoAtual: 79.90,
        desconto: 60,
        cor: "resident",
        capa: "RESIDENT EVIL 4",
        destaque: false,
    },
    {
        id: 11,
        nome: "Hogwarts Legacy",
        categoria: "Aventura",
        descricao: "Explore segredos, feitiços e aventuras no universo mágico.",
        precoAntigo: 199.90,
        precoAtual: 59.90,
        desconto: 70,
        cor: "hogwarts2",
        capa: "HOGWARTS LEGACY",
        destaque: false,
    },
    {
        id: 12,
        nome: "Mortal Kombat 1",
        categoria: "Luta",
        descricao: "Entre em combates intensos e enfrente seus adversários.",
        precoAntigo: 249.90,
        precoAtual: 99.90,
        desconto: 60,
        cor: "mortal",
        capa: "MORTAL KOMBAT",
        destaque: false,
    },
];

const categorias = [
    "Todos",
    "FPS",
    "Ação",
    "RPG",
    "Aventura",
    "Corrida",
    "Terror",
    "Luta",
];

export default function Promocoes() {
    const [busca, setBusca] = useState("");
    const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos");
    const [ordem, setOrdem] = useState("desconto");

    const jogosFiltrados = jogosIniciais
        .filter((jogo) =>
            jogo.nome.toLowerCase().includes(busca.toLowerCase())
        )
        .filter((jogo) =>
            categoriaSelecionada === "Todos" ||
            jogo.categoria === categoriaSelecionada
        )
        .sort((a, b) => {
            if (ordem === "menorPreco") {
                return a.precoAtual - b.precoAtual;
            }

            if (ordem === "maiorDesconto") {
                return b.desconto - a.desconto;
            }

            return b.desconto - a.desconto;
        });

    const ofertasDestaque = jogosIniciais.filter(
        (jogo) => jogo.destaque
    );

    function formatarPreco(valor: number) {
        return valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    }

    return (
        <main className={styles.container}>

            {/* CABEÇALHO */}

            <header className={styles.header}>
                <h1>IE<span>2A</span></h1>

                <nav>
                    <a href="/dashboard">Início</a>
                    <a href="/favoritos">Favoritos</a>
                    <a href="/perfil">Perfil</a>
                </nav>
            </header>

            {/* BANNER PRINCIPAL */}

            <section className={styles.banner}>

                <div className={styles.bannerConteudo}>
                    <span className={styles.bannerTag}>
                        OFERTAS ESPECIAIS IE2A
                    </span>

                    <h2>
                        Grandes jogos.
                        <br />
                        <span>Pequenos preços.</span>
                    </h2>

                    <p>
                        Aproveite descontos incríveis em jogos
                        populares e encontre sua próxima aventura.
                    </p>

                    <a href="#ofertas" className={styles.bannerBotao}>
                        EXPLORAR OFERTAS
                    </a>
                </div>

                <div className={styles.bannerVisual}>
                    <span className={styles.bannerPorcentagem}>
                        -80%
                    </span>
                    <span className={styles.bannerTexto}>
                        DESCONTOS IMPERDÍVEIS
                    </span>
                    <span className={styles.bannerIcone}>🎮</span>
                </div>

            </section>

            {/* DESTAQUES */}

            <section className={styles.destaques}>

                <div className={styles.tituloSecao}>
                    <div>
                        <span>SELEÇÃO ESPECIAL</span>
                        <h2>Ofertas em destaque</h2>
                    </div>
                </div>

                <div className={styles.destaquesLista}>

                    {ofertasDestaque.map((jogo) => (

                        <div
                            className={styles.destaqueCard}
                            key={jogo.id}
                        >
                            <div className={`${styles.destaqueCapa} ${styles[jogo.cor]}`}>
                                <span>{jogo.capa}</span>
                                <span className={styles.desconto}>
                                    -{jogo.desconto}%
                                </span>
                            </div>

                            <div className={styles.destaqueInfo}>
                                <h3>{jogo.nome}</h3>
                                <span>{jogo.categoria}</span>

                                <div className={styles.preco}>
                                    <del>{formatarPreco(jogo.precoAntigo)}</del>
                                    <strong>{formatarPreco(jogo.precoAtual)}</strong>
                                </div>
                            </div>
                        </div>

                    ))}

                </div>

            </section>

            {/* CATÁLOGO */}

            <section className={styles.catalogo} id="ofertas">

                <div className={styles.catalogoTitulo}>
                    <div>
                        <span>ENCONTRE SUA PRÓXIMA AVENTURA</span>
                        <h2>Todas as promoções</h2>
                        <p>
                            Confira os jogos disponíveis em nossa seleção de ofertas.
                        </p>
                    </div>

                    <div className={styles.total}>
                        <strong>{jogosFiltrados.length}</strong>
                        <span>Ofertas encontradas</span>
                    </div>
                </div>

                {/* PESQUISA E ORDENAÇÃO */}

                <div className={styles.ferramentas}>

                    <input
                        type="text"
                        placeholder="Pesquisar jogo..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                    />

                    <select
                        value={ordem}
                        onChange={(e) => setOrdem(e.target.value)}
                    >
                        <option value="desconto">Maior desconto</option>
                        <option value="menorPreco">Menor preço</option>
                        <option value="maiorDesconto">Melhores ofertas</option>
                    </select>

                </div>

                {/* FILTROS */}

                <div className={styles.filtros}>

                    {categorias.map((categoria) => (

                        <button
                            key={categoria}
                            className={
                                categoriaSelecionada === categoria
                                    ? styles.filtroAtivo
                                    : ""
                            }
                            onClick={() => setCategoriaSelecionada(categoria)}
                        >
                            {categoria}
                        </button>

                    ))}

                </div>

                {/* JOGOS */}

                {jogosFiltrados.length > 0 ? (

                    <div className={styles.lista}>

                        {jogosFiltrados.map((jogo) => (

                            <article className={styles.card} key={jogo.id}>

                                <div className={`${styles.capa} ${styles[jogo.cor]}`}>

                                    <span className={styles.capaNome}>
                                        {jogo.capa}
                                    </span>

                                    <span className={styles.desconto}>
                                        -{jogo.desconto}%
                                    </span>

                                </div>

                                <div className={styles.cardInfo}>

                                    <div className={styles.cardCabecalho}>
                                        <span className={styles.categoria}>
                                            {jogo.categoria}
                                        </span>

                                        <span className={styles.coracao}>
                                            ★
                                        </span>
                                    </div>

                                    <h3>{jogo.nome}</h3>

                                    <p>{jogo.descricao}</p>

                                    <div className={styles.cardRodape}>

                                        <div className={styles.precos}>
                                            <del>
                                                {formatarPreco(jogo.precoAntigo)}
                                            </del>

                                            <strong>
                                                {formatarPreco(jogo.precoAtual)}
                                            </strong>
                                        </div>

                                        <button
                                            onClick={() => alert("Em breve!")}
                                        >
                                            Ver oferta
                                        </button>

                                    </div>

                                </div>

                            </article>

                        ))}

                    </div>

                ) : (

                    <div className={styles.vazio}>
                        <span>⌕</span>
                        <h3>Nenhum jogo encontrado</h3>
                        <p>
                            Tente pesquisar outro nome ou selecionar outra categoria.
                        </p>
                    </div>

                )}

            </section>

            {/* RODAPÉ */}

            <footer className={styles.footer}>
                <strong>IE<span>2A</span></strong>
                <p>© 2026 IE2A - Todos os direitos reservados.</p>
                <span>SEU PRÓXIMO JOGO COMEÇA AQUI.</span>
            </footer>

        </main>
    );
}
