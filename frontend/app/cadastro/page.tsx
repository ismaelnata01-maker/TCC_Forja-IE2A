"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function CadastroPage() {
    const router = useRouter();
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function cadastrar(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setErro("");
        const form = new FormData(e.currentTarget);
        const senha = String(form.get("senha"));
        const confirmar = String(form.get("confirmar"));

        if (senha !== confirmar) {
            setErro("As senhas não coincidem.");
            return;
        }
        if (senha.length < 6) {
            setErro("A senha deve ter pelo menos 6 caracteres.");
            return;
        }
        const cpf = String(form.get("cpf")).replace(/\D/g, "");
        if (cpf.length !== 11) {
            setErro("Informe um CPF válido com 11 números.");
            return;
        }

        setCarregando(true);
        try {
            const response = await fetch("/api/cadastro", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome: form.get("nome"),
                    email: form.get("email"),
                    cpf,
                    senha,
                    telefone: form.get("telefone"),
                    nascimento: form.get("nascimento"),
                    endereco: form.get("endereco"),
                }),
            });

            if (!response.ok) {
                const mensagem = await response.text();
                setErro(mensagem.replaceAll("\"", "") || "Não foi possível realizar o cadastro.");
                return;
            }
            router.push("/?cadastro=sucesso");
        } catch {
            setErro("Não foi possível conectar ao servidor.");
        } finally {
            setCarregando(false);
        }
    }

    return (
        <main className={styles.container}>
            <section className={styles.card}>
                <header className={styles.logo}>
                    <Link href="/" aria-label="Voltar para o login">←</Link>
                    <div>
                        <span>IE2A</span>
                        <p>SEU PRÓXIMO JOGO COMEÇA AQUI</p>
                    </div>
                </header>

                <div className={styles.titulo}>
                    <h1>Crie sua conta</h1>
                    <p>Preencha seus dados para acessar o sistema.</p>
                </div>

                <form onSubmit={cadastrar}>
                    <div className={styles.grid}>
                        <div className={styles.campo}>
                            <label htmlFor="nome">Nome completo</label>
                            <input id="nome" name="nome" placeholder="Seu nome" required />
                        </div>
                        <div className={styles.campo}>
                            <label htmlFor="cpf">CPF</label>
                            <input id="cpf" name="cpf" placeholder="000.000.000-00" required />
                        </div>
                        <div className={styles.campo}>
                            <label htmlFor="email">E-mail</label>
                            <input id="email" name="email" type="email" placeholder="voce@exemplo.com" required />
                        </div>
                        <div className={styles.campo}>
                            <label htmlFor="telefone">Telefone</label>
                            <input id="telefone" name="telefone" placeholder="(00) 00000-0000" />
                        </div>
                        <div className={styles.campo}>
                            <label htmlFor="nascimento">Data de nascimento</label>
                            <input id="nascimento" name="nascimento" type="date" />
                        </div>
                        <div className={styles.campo}>
                            <label htmlFor="endereco">Endereço</label>
                            <input id="endereco" name="endereco" placeholder="Rua, número e bairro" />
                        </div>
                        <div className={styles.campo}>
                            <label htmlFor="senha">Senha</label>
                            <input id="senha" name="senha" type="password" placeholder="Mínimo 6 caracteres" required />
                        </div>
                        <div className={styles.campo}>
                            <label htmlFor="confirmar">Confirmar senha</label>
                            <input id="confirmar" name="confirmar" type="password" placeholder="Repita sua senha" required />
                        </div>
                    </div>

                    {erro && <p className={styles.erro}>{erro}</p>}
                    <button className={styles.botao} type="submit" disabled={carregando}>
                        {carregando ? "CADASTRANDO..." : "CRIAR CONTA"}
                    </button>
                </form>

                <p className={styles.entrada}>
                    Já possui uma conta? <Link href="/">Entrar</Link>
                </p>
            </section>
        </main>
    );
}
