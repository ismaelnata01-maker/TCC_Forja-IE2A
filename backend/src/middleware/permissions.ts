import { NextFunction, Response, Request } from "express";

export function isAdmin(
    request: Request,
    response: Response,
    next: NextFunction,
) {
    const user = request.body?.user as { cargo?: unknown } | undefined;
    if (user?.cargo !== "ADMIN") {
        return response.status(403).json("Acesso negado");
    }
    return next();
}

export function isAdminOrHimself(
    request: Request,
    response: Response,
    next: NextFunction,
) {
    const user = request.body?.user as { id?: unknown; cargo?: unknown } | undefined;
    if (user?.cargo !== "ADMIN" && user?.id !== Number(request.params.id)) {
        return response.status(403).json("Acesso negado");
    }
    return next();
}