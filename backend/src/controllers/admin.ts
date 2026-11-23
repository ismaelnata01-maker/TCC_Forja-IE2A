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

export default {
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
                    email: email.trim(),
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
            
            return response.status(200).json(funcionario);
        } catch (e) {
            return handleErrors(e, response);
        }
    },

    create: async(request: Request, response: Response) => {
        try {
            const { nome, email, cargo, nascimento, cpf, senha, telefone, endereco } = request.body;

            if(!nome || !email || !cargo || !cpf || !senha){
                return response.status(400).json("Dados do funcionario incompletos")
            }

            const funcionario = await prisma.funcionario.create({
                data: {
                    nome,
                    email,
                    cargo,
                    ...(nascimento ? { nascimento: new Date(nascimento) } : {}),
                    cpf,
                    senha: bcrypt.hashSync(senha, +process.env.BCRYPT_ROUNDS!),
                    telefone,
                    endereco,
                },
                omit:{
                    senha: true,
                }
            });

            return response.status(201).json(funcionario);

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

            const funcionario = await prisma.funcionario.update({
                where: {
                    id,
                },
                data: {
                    nome,
                    email,
                    cargo,
                    ...(nascimento ? { nascimento: new Date(nascimento) } : {}),
                    cpf,
                    ...(senha ? { senha: bcrypt.hashSync(senha, +process.env.BCRYPT_ROUNDS!) } : {}),
                    telefone,
                    endereco,
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