
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Heart } from "lucide-react";

import styles from "./sidebar.module.css";

const links = [
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
        nome: "Favoritos",
        caminho: "/favoritos",
        Icone: Heart,
    },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className={styles.sidebar}>
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

            <nav className={styles.navegacao}>
                <p className={styles.tituloMenu}>MENU PRINCIPAL</p>

                <div className={styles.listaLinks}>
                    {links.map((item) => {
                        const Icone = item.Icone;

                        const ativo = pathname === item.caminho;

                        return (
                            <Link
                                key={item.caminho}
                                href={item.caminho}
                                className={`${styles.link} ${
                                    ativo ? styles.ativo : ""
                                }`}
                            >
                                <Icone size={19} />
                                <span>{item.nome}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            <div className={styles.rodape}>
                <strong>IE2A STORE</strong>
                <p>© 2026 Todos os direitos reservados.</p>
            </div>
        </aside>
    );
}
