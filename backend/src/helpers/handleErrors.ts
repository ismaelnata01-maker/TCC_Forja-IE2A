import { Response } from "express";

export function handleErrors(error: unknown, response: Response) {
    if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "P2002"
    ) {
        return response.status(409).json("Registro já cadastrado");
    }
    if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "P2025"
    ) {
        return response.status(404).json("Registro não encontrado");
    }
    if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "P2003"
    ) {
        return response.status(404).json("Registro relacionado não encontrado");
    }
    console.error(error);
    return response.status(500).json("Erro interno do servidor");
}
