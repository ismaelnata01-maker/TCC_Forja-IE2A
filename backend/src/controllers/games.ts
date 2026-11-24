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
            if (!titulo || !descricao || !genero || !plataforma) {
                return response.status(400).json("Dados do jogo incompletos");
            }
            const jogo = await prisma.jogo.create({
                data: {
                    titulo,
                    descricao,
                    genero,
                    plataforma,
                    imagemUrl: imagemUrl || null,
                    anoLancamento: anoLancamento ? Number(anoLancamento) : null,
                    preco: preco === undefined ? 0 : Number(preco),
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
