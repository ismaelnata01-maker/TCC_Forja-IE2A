import { Request, Response } from "express";
import { prisma } from "../../config/prisma";
import { handleErrors } from "../helpers/handleErrors";

function parseId(value: string | string[] | undefined): number | null {
    if (typeof value !== "string") {
        return null;
    }
    const id = Number(value);
    return Number.isSafeInteger(id) && id > 0 ? id : null;
}

export default {
    list: async (_request: Request, response: Response) => {
        try {
            const jogos = await prisma.jogo.findMany({
                orderBy: { titulo: "asc" },
            });
            return response.status(200).json(jogos);
        } catch (error) {
            return handleErrors(error, response);
        }
    },

    getById: async (request: Request, response: Response) => {
        try {
            const id = parseId(request.params.id);
            if (id === null) {
                return response.status(400).json("ID inválido");
            }
            const jogo = await prisma.jogo.findUnique({ where: { id } });
            if (!jogo) {
                return response.status(404).json("Jogo não encontrado");
            }
            return response.status(200).json(jogo);
        } catch (error) {
            return handleErrors(error, response);
        }
    },

    create: async (request: Request, response: Response) => {
        try {
            const { titulo, descricao, genero, plataforma, imagemUrl, anoLancamento, preco } = request.body;
            if (
                typeof titulo !== "string" || !titulo.trim() ||
                typeof descricao !== "string" || !descricao.trim() ||
                typeof genero !== "string" || !genero.trim() ||
                typeof plataforma !== "string" || !plataforma.trim()
            ) {
                return response.status(400).json("Dados do jogo incompletos");
            }
            const ano = anoLancamento === undefined ? null : Number(anoLancamento);
            const precoNumero = preco === undefined ? 0 : Number(preco);
            if ((ano !== null && (!Number.isSafeInteger(ano) || ano < 1950 || ano > 2100)) ||
                !Number.isFinite(precoNumero) || precoNumero < 0) {
                return response.status(400).json("Dados numericos do jogo invalidos");
            }
            const jogo = await prisma.jogo.create({
                data: {
                    titulo: titulo.trim(),
                    descricao: descricao.trim(),
                    genero: genero.trim(),
                    plataforma: plataforma.trim(),
                    imagemUrl: imagemUrl || null,
                    anoLancamento: ano,
                    preco: precoNumero,
                },
            });
            return response.status(201).json(jogo);
        } catch (error) {
            return handleErrors(error, response);
        }
    },

    update: async (request: Request, response: Response) => {
        try {
            const id = parseId(request.params.id);
            if (id === null) {
                return response.status(400).json("ID inválido");
            }
            const { titulo, descricao, genero, plataforma, imagemUrl, anoLancamento, preco } = request.body;
            if ((titulo !== undefined && (typeof titulo !== "string" || !titulo.trim())) ||
                (descricao !== undefined && (typeof descricao !== "string" || !descricao.trim())) ||
                (genero !== undefined && (typeof genero !== "string" || !genero.trim())) ||
                (plataforma !== undefined && (typeof plataforma !== "string" || !plataforma.trim()))) {
                return response.status(400).json("Dados do jogo invalidos");
            }
            if (anoLancamento !== undefined) {
                const ano = anoLancamento === null || anoLancamento === "" ? null : Number(anoLancamento);
                if (ano !== null && (!Number.isSafeInteger(ano) || ano < 1950 || ano > 2100)) {
                    return response.status(400).json("Ano de lancamento invalido");
                }
            }
            if (preco !== undefined && (!Number.isFinite(Number(preco)) || Number(preco) < 0)) {
                return response.status(400).json("Preco invalido");
            }
            const jogo = await prisma.jogo.update({
                where: { id },
                data: {
                    ...(titulo !== undefined ? { titulo } : {}),
                    ...(descricao !== undefined ? { descricao } : {}),
                    ...(genero !== undefined ? { genero } : {}),
                    ...(plataforma !== undefined ? { plataforma } : {}),
                    ...(imagemUrl !== undefined ? { imagemUrl: imagemUrl || null } : {}),
                    ...(anoLancamento !== undefined ? { anoLancamento: anoLancamento ? Number(anoLancamento) : null } : {}),
                    ...(preco !== undefined ? { preco: Number(preco) } : {}),
                },
            });
            return response.status(200).json(jogo);
        } catch (error) {
            return handleErrors(error, response);
        }
    },

    delete: async (request: Request, response: Response) => {
        try {
            const id = parseId(request.params.id);
            if (id === null) {
                return response.status(400).json("ID inválido");
            }
            await prisma.jogo.delete({ where: { id } });
            return response.status(200).json("Jogo removido");
        } catch (error) {
            return handleErrors(error, response);
        }
    },
};
