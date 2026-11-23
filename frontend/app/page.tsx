
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Button from "@/componentes/button";

export default function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);
    const router = useRouter();

    async function entrar(e: React.FormEvent) {
        e.preventDefault();
        setErro("");

        if (!email || !senha) {
            setErro("Preencha todos os campos!");
            return;
        }

        setCarregando(true);
        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, senha }),
            });

            if (!response.ok) {
                const mensagem = await response.text();
                setErro(mensagem.replaceAll("\"", "") || "Email ou senha inválidos.");
                return;
            }

            router.push("/dashboard");
            router.refresh();
        } catch {
            setErro("Não foi possível conectar ao servidor.");
        } finally {
            setCarregando(false);
        }
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
                        <label htmlFor="email">E-mail</label>

                        <input
                            id="email"
                            type="email"
                            placeholder="Digite seu e-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className={styles.campo}>
                        <label htmlFor="senha">Senha</label>

                        <input
                            id="senha"
                            type="password"
                            placeholder="Digite sua senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                        />
                    </div>

                    <button type="submit" disabled={carregando}>
                        {carregando ? "ENTRANDO..." : "ENTRAR"}
                    </button>

                </form>

                {erro && <p className={styles.erro}>{erro}</p>}

                <p className={styles.cadastro}>
                    Ainda não tem uma conta? <Link href="/cadastro">Cadastre-se</Link>
                </p>

               <div className={styles.rodape}>
                    © 2026 IE2A - Todos os direitos reservados.
                </div>

            </div>

        </main>
    );
}
