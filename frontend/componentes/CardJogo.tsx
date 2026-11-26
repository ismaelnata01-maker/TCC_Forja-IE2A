
import Image from "next/image";
import styles from "./cardJogo.module.css";

type CardJogoProps = {
    nome: string;
    imagem: string;
    link: string;
    categoria?: string;
    preco?: string;
    precoAntigo?: string;
    desconto?: string;
    avaliacao?: string;
};

export default function CardJogo({
    nome,
    imagem,
    link,
    categoria,
    preco,
    precoAntigo,
    desconto,
    avaliacao,
}: CardJogoProps) {
    return (
        <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.linkCard}
        >
            <article className={styles.cardJogo}>
                <div className={styles.imagemJogo}>
                    <Image
                        src={imagem}
                        alt={nome}
                        fill
                        sizes="(max-width: 750px) 50vw, 25vw"
                    />

                    {desconto && (
                        <span className={styles.seloDesconto}>
                            {desconto}
                        </span>
                    )}
                </div>

                <div className={styles.infoJogo}>
                    {categoria && <span>{categoria}</span>}

                    <h3>{nome}</h3>

                    {precoAntigo && preco ? (
                        <div className={styles.precosPromocao}>
                            <del>{precoAntigo}</del>
                            <strong>{preco}</strong>
                        </div>
                    ) : (
                        preco && <strong>{preco}</strong>
                    )}

                    {avaliacao && (
                        <div className={styles.avaliacao}>
                            <span>★</span>
                            <span>{avaliacao}</span>
                        </div>
                    )}
                </div>
            </article>
        </a>
    );
}
