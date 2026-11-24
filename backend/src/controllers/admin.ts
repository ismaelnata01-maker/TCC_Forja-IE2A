import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/prisma";
import { handleErrors } from "../helpers/handleErrors";

function parseId(value: string | string[] | undefined): number | null {
    if (typeof value !== "string") {
        return null;
    }

    const id = Number(value);
    return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function normalizeCpf(value: unknown): string {
    return typeof value === "string" ? value.replace(/\D/g, "") : "";
}

export default {
    me: async (request: Request, response: Response) => {
        try {
            const user = request.body.user as { id: number } | undefined;
            if (!user?.id) {
                return response.status(401).json("Não autenticado");
            }
            const funcionario = await prisma.funcionario.findUnique({
                where: { id: user.id },
                omit: { senha: true },
            });
            if (!funcionario) {
                return response.status(404).json("Usuário não encontrado");
            }
            return response.status(200).json(funcionario);
        } catch (e) {
            if (
                typeof e === "object" &&
                e !== null &&
                "code" in e &&
                e.code === "P2002"
            ) {
                return response.status(409).json("Este e-mail já está cadastrado");
            }
            return handleErrors(e, response);
        }
    },

    login: async (request: Request, response: Response) => {
        try {
            const body = request.body as { email?: unknown; senha?: unknown } | undefined;
            const email = body?.email;
            const senha = body?.senha;

            if (
                typeof email !== "string" ||
                !email.trim() ||
                typeof senha !== "string" ||
                !senha
            ) {
                return response.status(400).json("Dados incompletos");
            }

            const funcionario = await prisma.funcionario.findUnique({
                where: {
                    email: email.trim().toLowerCase(),
                },
            });

            if (!funcionario || !(await bcrypt.compare(senha, funcionario.senha))) {
                return response.status(401).json("Email e/ou senha inválidos");
            }

            const jwtSecret = process.env.JWT_SECRET;
            if (!jwtSecret) {
                throw new Error("JWT_SECRET não configurado");
            }

            const token = jwt.sign(
                { id: funcionario.id, cargo: funcionario.cargo},
                jwtSecret,
                {
                    expiresIn: "1d",
                },
            );

            return response.status(200).json(token)
        } catch (e) {
            return handleErrors(e, response);
        }
    },



    list: async ( request: Request, response: Response ) => {
        try {
            const funcionarios = await prisma.funcionario.findMany({
                omit:{
                    senha: true,
                }
            });

            return response.status(200).json(funcionarios);
        } catch(e) {
            return handleErrors(e, response);
        }
    },

    getById: async(request: Request, response: Response) => {
        try {
            const id = parseId(request.params.id);
            if (id === null) {
                return response.status(400).json("ID inválido");
            }

            const funcionario = await prisma.funcionario.findUnique({
                where: {
                    id,
                 },
                 omit:{
                    senha: true,
                }
            })
            if (!funcionario) {
                return response.status(404).json("Usuário não encontrado");
            }
            return response.status(200).json(funcionario);
        } catch (e) {
            return handleErrors(e, response);
        }
    },

    create: async(request: Request, response: Response) => {
        try {
            const { nome, email, cargo, nascimento, cpf, senha, telefone, endereco } = request.body;

            if(!nome || !email || !cpf || !senha){
                return response.status(400).json("Dados do funcionario incompletos")
            }
            const cpfNormalizado = normalizeCpf(cpf);
            if (cpfNormalizado.length !== 11) {
                return response.status(400).json("CPF inválido");
            }
            if (typeof senha !== "string" || senha.length < 6) {
                return response.status(400).json("A senha deve ter pelo menos 6 caracteres");
            }

            const emailNormalizado = String(email).trim().toLowerCase();
            const existente = await prisma.funcionario.findUnique({
                where: { email: emailNormalizado },
            });
            if (existente) {
                return response.status(409).json("Este e-mail já está cadastrado");
            }
            const cpfExistente = await prisma.funcionario.findUnique({
                where: { cpf: cpfNormalizado },
            });
            if (cpfExistente) {
                return response.status(409).json("Este CPF já está cadastrado");
            }

            const funcionario = await prisma.funcionario.create({
                data: {
                    nome: String(nome).trim(),
                    email: emailNormalizado,
                    cargo: "FUNCIONARIO",
                    ...(nascimento ? { nascimento: new Date(nascimento) } : {}),
                    cpf: cpfNormalizado,
                    senha: bcrypt.hashSync(senha, Number(process.env.BCRYPT_ROUNDS || 10)),
                    telefone,
                    endereco,
                },
                omit:{
                    senha: true,
                }
            });

            const jwtSecret = process.env.JWT_SECRET;
            if (!jwtSecret) {
                throw new Error("JWT_SECRET não configurado");
            }
            const token = jwt.sign(
                { id: funcionario.id, cargo: funcionario.cargo },
                jwtSecret,
                { expiresIn: "1d" },
            );
            return response.status(201).json(token);

        } catch (e) {
            return handleErrors(e, response); 
        }
    },

    update: async(request: Request, response: Response) => {
        try {
            const id = parseId(request.params.id);
            if (id === null) {
                return response.status(400).json("ID inválido");
            }
            const { nome, email, cargo, nascimento, cpf, senha, telefone, endereco } = request.body;
            if (email !== undefined) {
                if (typeof email !== "string" || !email.trim()) {
                    return response.status(400).json("E-mail inválido");
                }
            }
            if (cpf !== undefined) {
                const cpfNormalizado = normalizeCpf(cpf);
                if (cpfNormalizado.length !== 11) {
                    return response.status(400).json("CPF inválido");
                }
            }
            if (senha !== undefined && (typeof senha !== "string" || senha.length < 6)) {
                return response.status(400).json("A senha deve ter pelo menos 6 caracteres");
            }
            if (nascimento !== undefined && (typeof nascimento !== "string" || Number.isNaN(new Date(nascimento).getTime()))) {
                return response.status(400).json("Data de nascimento inválida");
            }
            const user = request.body.user as { cargo?: unknown } | undefined;
            if (cargo !== undefined && user?.cargo !== "ADMIN") {
                return response.status(403).json("Apenas administradores podem alterar o cargo");
            }
            if (cargo !== undefined && cargo !== "ADMIN" && cargo !== "FUNCIONARIO") {
                return response.status(400).json("Cargo inválido");
            }

            const funcionario = await prisma.funcionario.update({
                where: {
                    id,
                },
                data: {
                    ...(nome !== undefined ? { nome: String(nome).trim() } : {}),
                    ...(email !== undefined ? { email: String(email).trim().toLowerCase() } : {}),
                    ...(cargo !== undefined ? { cargo } : {}),
                    ...(nascimento !== undefined ? { nascimento: nascimento ? new Date(nascimento) : null } : {}),
                    ...(cpf !== undefined ? { cpf: normalizeCpf(cpf) } : {}),
                    ...(senha !== undefined ? { senha: bcrypt.hashSync(senha, Number(process.env.BCRYPT_ROUNDS || 10)) } : {}),
                    ...(telefone !== undefined ? { telefone: typeof telefone === "string" ? telefone : null } : {}),
                    ...(endereco !== undefined ? { endereco: typeof endereco === "string" ? endereco : null } : {}),
                },
                omit:{
                    senha: true,
                }
            });

            return response.status(200).json(funcionario);
        } catch (e) {
            return handleErrors(e, response);
        }
    },

    delete: async (request: Request, response: Response) => {
        try {
            const id = parseId(request.params.id);
            if (id === null) {
                return response.status(400).json("ID inválido");
            }

            const funcionario = await prisma.funcionario.delete({
                where: {
                    id,

                },
                omit:{
                    senha: true,
                }
            });

            return response.status(200).json(funcionario)
        } catch (e){ 
            return handleErrors(e, response);
        }
    }
}