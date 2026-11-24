import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../config/prisma";

async function seedAdmin() {
    const nome = process.env.ADMIN_NAME?.trim();
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const cpf = process.env.ADMIN_CPF?.replace(/\D/g, "");
    const senha = process.env.ADMIN_PASSWORD;
    const rounds = Number(process.env.BCRYPT_ROUNDS ?? 10);

    if (!nome || !email || !cpf || !senha) {
        throw new Error("Configure ADMIN_NAME, ADMIN_EMAIL, ADMIN_CPF e ADMIN_PASSWORD");
    }
    if (cpf.length !== 11 || senha.length < 12 || !Number.isInteger(rounds) || rounds < 10 || rounds > 14) {
        throw new Error("CPF, ADMIN_PASSWORD ou BCRYPT_ROUNDS invalidos");
    }

    const existente = await prisma.funcionario.findUnique({ where: { email } });
    if (existente) {
        if (existente.cargo !== "ADMIN") {
            throw new Error("O e-mail ADMIN_EMAIL já pertence a uma conta não administradora");
        }
        console.log("Administrador já configurado");
        return;
    }

    await prisma.funcionario.create({
        data: {
            nome,
            email,
            cpf,
            senha: await bcrypt.hash(senha, rounds),
            cargo: "ADMIN",
        },
    });
    console.log("Administrador criado");
}

seedAdmin()
    .catch((error: unknown) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
