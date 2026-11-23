
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    Home,
    Compass,
    Tag,
    Trophy,
    Heart,
    User,
    Settings,
    LogOut,
} from "lucide-react";

import styles from "./sidebar.module.css";

const linksPrincipais = [
    {
        nome: "Início",
        caminho: "/dashboard",
        Icone: Home,
    },
    {
        nome: "Catálogo",
        caminho: "/catalogo",
        Icone: Compass,
    },
    {
        nome: "Promoções",
        caminho: "/promocoes",
        Icone: Tag,
    },
    {
        nome: "Lançamentos",
        caminho: "/lancamentos",
        Icone: Trophy,
    },
    {
        nome: "Favoritos",
        caminho: "/favoritos",
        Icone: Heart,
    },
];

const linksConta = [
    {
        nome: "Meu perfil",
        caminho: "/perfil",
        Icone: User,
    },
    {
        nome: "Configurações",
        caminho: "/configuracoes",
        Icone: Settings,
    },
    {
        nome: "Sair",
        caminho: "/login",
        Icone: LogOut,
    },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className={styles.sidebar}>

            {/* LOGO */}
            <Link href="/dashboard" className={styles.logo}>
                <Image
                    src="/logo.png"
                    alt="IE2A Store"
                    width={55}
                    height={55}
                    priority
                />

                <span>
                    IE<span className={styles.logoDestaque}>2A</span>
                </span>
            </Link>

            {/* MENU PRINCIPAL */}
            <nav className={styles.navegacao}>
                <p className={styles.tituloMenu}>
                    MENU PRINCIPAL
                </p>

                <div className={styles.listaLinks}>
                    {linksPrincipais.map(({ nome, caminho, Icone }) => {
                        const ativo = pathname === caminho;

                        return (
                            <Link
                                key={caminho}
                                href={caminho}
                                className={`${styles.link} ${
                                    ativo ? styles.ativo : ""
                                }`}
                            >
                                <Icone size={19} />
                                <span>{nome}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* MINHA CONTA */}
            <nav className={styles.menuInferior}>
                <p className={styles.tituloMenu}>
                    MINHA CONTA
                </p>

                <div className={styles.listaLinks}>
                    {linksConta.map(({ nome, caminho, Icone }) => {
                        const ativo = pathname === caminho;

                        return (
                            <Link
                                key={caminho}
                                href={caminho}
                                className={`${styles.link} ${
                                    ativo ? styles.ativo : ""
                                }`}
                            >
                                <Icone size={19} />
                                <span>{nome}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* RODAPÉ */}
            <div className={styles.rodape}>
                <strong>IE2A STORE</strong>
                <p>© 2026 Todos os direitos reservados.</p>
            </div>

        </aside>
    );
}
