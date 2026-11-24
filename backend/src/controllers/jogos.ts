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

function userId(request: Request): number | null {
    const user = request.body?.user as { id?: unknown } | undefined;
    return typeof user?.id === "number" ? user.id : null;
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

    listWishlist: async (request: Request, response: Response) => {
        try {
            const funcionarioId = userId(request);
            if (!funcionarioId) {
                return response.status(401).json("Não autenticado");
            }
            const itens = await prisma.listaDesejos.findMany({
                where: { funcionarioId },
                include: { jogo: true },
                orderBy: { createdAt: "desc" },
            });
            return response.status(200).json(itens);
        } catch (error) {
            return handleErrors(error, response);
        }
    },

    addWishlist: async (request: Request, response: Response) => {
        try {
            const funcionarioId = userId(request);
            const jogoId = parseId(request.params.jogoId);
            if (!funcionarioId) return response.status(401).json("Não autenticado");
            if (jogoId === null) return response.status(400).json("ID inválido");
            const item = await prisma.listaDesejos.create({ data: { funcionarioId, jogoId }, include: { jogo: true } });
            return response.status(201).json(item);
        } catch (error) {
            return handleErrors(error, response);
        }
    },

    removeWishlist: async (request: Request, response: Response) => {
        try {
            const funcionarioId = userId(request);
            const jogoId = parseId(request.params.jogoId);
            if (!funcionarioId) return response.status(401).json("Não autenticado");
            if (jogoId === null) return response.status(400).json("ID inválido");
            await prisma.listaDesejos.delete({ where: { funcionarioId_jogoId: { funcionarioId, jogoId } } });
            return response.status(200).json("Jogo removido da lista de desejos");
        } catch (error) {
            return handleErrors(error, response);
        }
    },

    listLibrary: async (request: Request, response: Response) => {
        try {
            const funcionarioId = userId(request);
            if (!funcionarioId) return response.status(401).json("Não autenticado");
            const itens = await prisma.biblioteca.findMany({
                where: { funcionarioId },
                include: { jogo: true },
                orderBy: { updatedAt: "desc" },
            });
            return response.status(200).json(itens);
        } catch (error) {
            return handleErrors(error, response);
        }
    },

    addToLibrary: async (request: Request, response: Response) => {
        try {
            const funcionarioId = userId(request);
            const jogoId = parseId(request.params.jogoId);
            if (!funcionarioId) return response.status(401).json("Não autenticado");
            if (jogoId === null) return response.status(400).json("ID inválido");
            const item = await prisma.biblioteca.create({
                data: { funcionarioId, jogoId, status: "NAO_INICIADO" },
                include: { jogo: true },
            });
            return response.status(201).json(item);
        } catch (error) {
            return handleErrors(error, response);
        }
    },

    updateLibrary: async (request: Request, response: Response) => {
        try {
            const funcionarioId = userId(request);
            const jogoId = parseId(request.params.jogoId);
            if (!funcionarioId) return response.status(401).json("Não autenticado");
            if (jogoId === null) return response.status(400).json("ID inválido");
            const { horasJogadas, status, conquistas } = request.body;
            const item = await prisma.biblioteca.update({
                where: { funcionarioId_jogoId: { funcionarioId, jogoId } },
                data: {
                    ...(horasJogadas !== undefined ? { horasJogadas: Number(horasJogadas) } : {}),
                    ...(status !== undefined ? { status } : {}),
                    ...(conquistas !== undefined ? { conquistas: Number(conquistas) } : {}),
                },
                include: { jogo: true },
            });
            return response.status(200).json(item);
        } catch (error) {
            return handleErrors(error, response);
        }
    },

    removeFromLibrary: async (request: Request, response: Response) => {
        try {
            const funcionarioId = userId(request);
            const jogoId = parseId(request.params.jogoId);
            if (!funcionarioId) return response.status(401).json("Não autenticado");
            if (jogoId === null) return response.status(400).json("ID inválido");
            await prisma.biblioteca.delete({ where: { funcionarioId_jogoId: { funcionarioId, jogoId } } });
            return response.status(200).json("Jogo removido da biblioteca");
        } catch (error) {
            return handleErrors(error, response);
        }
    },
};
