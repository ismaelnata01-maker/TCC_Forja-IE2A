import { Response } from "express";

export function handleErrors(error: unknown, response: Response) {
    console.error(error);
    return response.status(500).json("Erro interno do servidor");
}
