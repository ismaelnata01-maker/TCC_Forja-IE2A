
"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function Perfil() {
    const [nome, setNome] = useState("Jogador IE2A");
    const [email, setEmail] = useState("jogador@email.com");
    const [editando, setEditando] = useState(false);

    function salvar(e: React.FormEvent) {
        e.preventDefault();
        setEditando(false);
        alert("Perfil atualizado com sucesso!");
    }

    return (
        <main className={styles.container}>

            <header className={styles.header}>
                <h1>IE<span>2A</span></h1>
                <a href="/dashboard">Voltar aos jogos</a>
            </header>

            <section className={styles.perfil}>

                <div className={styles.topo}>
                    <div className={styles.avatar}>
                        {nome.charAt(0).toUpperCase()}
                    </div>

                    <div className={styles.identificacao}>
                        <h2>{nome}</h2>
                        <p>Jogador da plataforma IE2A</p>
                        <span>★ MEMBRO IE2A</span>
                    </div>
                </div>

                <div className={styles.divisor}></div>

                <h3>Estatísticas</h3>

                <div className={styles.estatisticas}>
                    <div className={styles.card}>
                        <span>🎮</span>
                        <h2>12</h2>
                        <p>Jogos jogados</p>
                    </div>

                    <div className={styles.card}>
                        <span>🏆</span>
                        <h2>08</h2>
                        <p>Conquistas</p>
                    </div>

                    <div className={styles.card}>
                        <span>⭐</span>
                        <h2>250</h2>
                        <p>Pontuação</p>
                    </div>
                </div>

                <div className={styles.divisor}></div>

                <div className={styles.tituloInfo}>
                    <h3>Informações da conta</h3>

                    <button
                        onClick={() => setEditando(!editando)}
                    >
                        {editando ? "Cancelar" : "Editar perfil"}
                    </button>
                </div>

                {editando ? (

                    <form onSubmit={salvar} className={styles.formulario}>

                        <label>Nome</label>
                        <input
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                        />

                        <label>E-mail</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <button type="submit">
                            Salvar alterações
                        </button>

                    </form>

                ) : (

                    <div className={styles.informacoes}>
                        <div>
                            <span>Nome de usuário</span>
                            <p>{nome}</p>
                        </div>

                        <div>
                            <span>E-mail</span>
                            <p>{email}</p>
                        </div>

                        <div>
                            <span>Plataforma</span>
                            <p>IE2A Games</p>
                        </div>
                    </div>

                )}

            </section>

            <footer className={styles.footer}>
                © 2026 IE2A - Todos os direitos reservados.
            </footer>

        </main>
    );
}
