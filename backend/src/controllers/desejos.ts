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
    return typeof user?.id === "number" && Number.isSafeInteger(user.id) && user.id > 0
        ? user.id
        : null;
}

export default {
    list: async (request: Request, response: Response) => {
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

    add: async (request: Request, response: Response) => {
        try {
            const funcionarioId = userId(request);
            const jogoId = parseId(request.params.jogoId);
            if (!funcionarioId) {
                return response.status(401).json("Não autenticado");
            }
            if (jogoId === null) {
                return response.status(400).json("ID inválido");
            }

            const item = await prisma.listaDesejos.create({
                data: { funcionarioId, jogoId },
                include: { jogo: true },
            });
            return response.status(201).json(item);
        } catch (error) {
            return handleErrors(error, response);
        }
    },

    remove: async (request: Request, response: Response) => {
        try {
            const funcionarioId = userId(request);
            const jogoId = parseId(request.params.jogoId);
            if (!funcionarioId) {
                return response.status(401).json("Não autenticado");
            }
            if (jogoId === null) {
                return response.status(400).json("ID inválido");
            }

            await prisma.listaDesejos.delete({
                where: { funcionarioId_jogoId: { funcionarioId, jogoId } },
            });
            return response.status(200).json("Jogo removido da lista de desejos");
        } catch (error) {
            return handleErrors(error, response);
        }
    },
};
