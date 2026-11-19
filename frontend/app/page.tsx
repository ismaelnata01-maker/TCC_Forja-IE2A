"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    function entrar(e: React.FormEvent) {
        e.preventDefault();

        if (!email || !senha) {
            alert("Preencha todos os campos!");
            return;
        }

        alert("Login realizado com sucesso!");
    }

    return (
        <main className={styles.container}>

            <div className={styles.login}>

                <div className={styles.logo}>
                    <h1>IE2A</h1>
                    <p>SEU PRÓXIMO JOGO COMEÇA AQUI</p>
                </div>

                <h2>Bem-vindo de volta!</h2>
                <p className={styles.subtitulo}>
                    Entre na sua conta para continuar jogando.
                </p>

                <form onSubmit={entrar}>

                    <div className={styles.campo}>
                        <label>E-mail</label>
                        <input
                            type="email"
                            placeholder="Digite seu e-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className={styles.campo}>
                        <label>Senha</label>
                        <input
                            type="password"
                            placeholder="Digite sua senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                        />
                    </div>

                    <button type="submit">
                        ENTRAR
                    </button>

                </form>

               <div className={styles.rodape}>
                    © 2026 IE2A - Todos os direitos reservados.
                </div>

            </div>

        </main>
    );
}
