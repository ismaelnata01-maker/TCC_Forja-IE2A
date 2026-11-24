import { Request, Response } from "express";
import { prisma } from "../../config/prisma";
import { handleErrors } from "../helpers/handleErrors";

const statusValidos = ["NAO_INICIADO", "EM_ANDAMENTO", "CONCLUIDO"] as const;
type StatusBiblioteca = (typeof statusValidos)[number];

function parseId(value: string | string[] | undefined): number | null {
    if (typeof value !== "string") {
        return null;
    }
    const id = Number(value);
    return Number.isSafeInteger(id) && +id > 0 ? id : null;
}

function userId(request: Request): number | null {
    const user = request.body?.user as { id?: unknown } | undefined;
    return typeof user?.id === "number" && Number.isSafeInteger(user.id) && user.id > 0
        ? user.id
        : null;
}

function isStatusBiblioteca(value: unknown): value is StatusBiblioteca {
    return typeof value === "string" && statusValidos.includes(value as StatusBiblioteca);
}

export default {
    list: async (request: Request, response: Response) => {
        try {
            const funcionarioId = userId(request);
            if (funcionarioId === null) {
                return response.status(401).json("Não autenticado");
            }

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

    add: async (request: Request, response: Response) => {
        try {
            const funcionarioId = userId(request);
            const jogoId = parseId(request.params.jogoId);
            if (funcionarioId === null) {
                return response.status(401).json("Não autenticado");
            }
            if (jogoId === null) {
                return response.status(400).json("ID inválido");
            }

            const item = await prisma.biblioteca.create({
                data: { funcionarioId, jogoId, status: "NAO_INICIADO" },
                include: { jogo: true },
            });
            return response.status(201).json(item);
        } catch (error) {
            return handleErrors(error, response);
        }
    },

    update: async (request: Request, response: Response) => {
        try {
            const funcionarioId = userId(request);
            const jogoId = parseId(request.params.jogoId);
            if (funcionarioId === null) {
                return response.status(401).json("Não autenticado");
            }
            if (jogoId === null) {
                return response.status(400).json("ID inválido");
            }

            const { horasJogadas, status, conquistas } = request.body;
            if (
                (horasJogadas !== undefined &&
                    (typeof horasJogadas !== "number" ||
                        !Number.isFinite(horasJogadas) ||
                        horasJogadas < 0)) ||
                (status !== undefined && !isStatusBiblioteca(status)) ||
                (conquistas !== undefined &&
                    (!Number.isSafeInteger(conquistas) || conquistas < 0))
            ) {
                return response.status(400).json("Dados da biblioteca inválidos");
            }
            if (
                horasJogadas === undefined &&
                status === undefined &&
                conquistas === undefined
            ) {
                return response.status(400).json("Nenhum dado para atualizar");
            }

            const item = await prisma.biblioteca.update({
                where: { funcionarioId_jogoId: { funcionarioId, jogoId } },
                data: {
                    ...(horasJogadas !== undefined ? { horasJogadas } : {}),
                    ...(status !== undefined ? { status } : {}),
                    ...(conquistas !== undefined ? { conquistas } : {}),
                },
                include: { jogo: true },
            });
            return response.status(200).json(item);
        } catch (error) {
            return handleErrors(error, response);
        }
    },

    remove: async (request: Request, response: Response) => {
        try {
            const funcionarioId = userId(request);
            const jogoId = parseId(request.params.jogoId);
            if (funcionarioId === null) {
                return response.status(401).json("Não autenticado");
            }
            if (jogoId === null) {
                return response.status(400).json("ID inválido");
            }

            await prisma.biblioteca.delete({
                where: { funcionarioId_jogoId: { funcionarioId, jogoId } },
            });
            return response.status(200).json("Jogo removido da biblioteca");
        } catch (error) {
            return handleErrors(error, response);
        }
    },
};