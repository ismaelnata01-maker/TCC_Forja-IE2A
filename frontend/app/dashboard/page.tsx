import styles from "./page.module.css";

const atalhos = [
    { titulo: "Alunos", descricao: "Gerencie matrículas e dados", valor: "128", classe: "alunos", simbolo: "A" },
    { titulo: "Cursos", descricao: "Consulte aulas e turmas", valor: "16", classe: "cursos", simbolo: "C" },
    { titulo: "Funcionários", descricao: "Equipe administrativa", valor: "24", classe: "funcionarios", simbolo: "F" },
    { titulo: "Matrículas", descricao: "Novas inscrições", valor: "32", classe: "matriculas", simbolo: "M" },
];

export default function DashboardPage() {
    return (
        <div className={styles.shell}>
            <aside className={styles.sidebar}>
                <div className={styles.brand}>
                    <span className={styles.brandMark}>I</span>
                    <strong>IE2A</strong>
                </div>

                <nav className={styles.nav} aria-label="Menu principal">
                    <a className={styles.active} href="/dashboard"><span>⌂</span> Início</a>
                    <a href="#"><span>♙</span> Alunos</a>
                    <a href="#"><span>▦</span> Cursos</a>
                    <a href="#"><span>♟</span> Funcionários</a>
                    <a href="#"><span>✓</span> Matrículas</a>
                </nav>

                <a className={styles.sair} href="/"><span>↪</span> Sair</a>
            </aside>

            <main className={styles.main}>
                <header className={styles.header}>
                    <div>
                        <p className={styles.data}>Segunda-feira, 23 de novembro</p>
                        <h1>Bom dia!</h1>
                    </div>
                    <div className={styles.usuario}>
                        <div>
                            <strong>Administrador</strong>
                            <span>Gestor escolar</span>
                        </div>
                        <div className={styles.avatar}>A</div>
                    </div>
                </header>

                <section className={styles.conteudo}>
                    <div className={styles.tituloSecao}>
                        <div>
                            <span>Visão geral</span>
                            <h2>Painel administrativo</h2>
                        </div>
                        <button type="button">+ Novo cadastro</button>
                    </div>

                    <div className={styles.cards}>
                        {atalhos.map((item) => (
                            <article className={`${styles.card} ${styles[item.classe]}`} key={item.titulo}>
                                <div className={styles.cardTopo}>
                                    <div className={styles.icone}>{item.simbolo}</div>
                                    <span className={styles.status}>Ativo</span>
                                </div>
                                <strong className={styles.valor}>{item.valor}</strong>
                                <h3>{item.titulo}</h3>
                                <p>{item.descricao}</p>
                                <a href="#">Acessar módulo <span>→</span></a>
                            </article>
                        ))}
                    </div>

                    <div className={styles.grade}>
                        <section className={styles.painel}>
                            <div className={styles.painelTitulo}>
                                <h3>Últimos cadastros</h3>
                                <button type="button">Ver tudo</button>
                            </div>
                            <div className={styles.lista}>
                                {["Ana Souza", "Carlos Lima", "Julia Martins"].map((nome, index) => (
                                    <div className={styles.item} key={nome}>
                                        <div className={styles.miniAvatar}>{nome.charAt(0)}</div>
                                        <div><strong>{nome}</strong><span>{index === 0 ? "Matrícula realizada" : "Aluno cadastrado"}</span></div>
                                        <time>Hoje</time>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className={styles.painel}>
                            <div className={styles.painelTitulo}>
                                <h3>Resumo mensal</h3>
                                <span>Novembro</span>
                            </div>
                            <div className={styles.resumo}>
                                <div><strong>32</strong><span>Novas matrículas</span></div>
                                <div><strong>94%</strong><span>Presença média</span></div>
                            </div>
                        </section>
                    </div>
                </section>
            </main>
        </div>
    );
}