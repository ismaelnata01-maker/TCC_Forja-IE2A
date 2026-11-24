import assert from "node:assert/strict";
import test from "node:test";
import request from "supertest";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const suffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
const email = `teste${suffix}@forja.local`;
const cpf = `${Date.now()}`.slice(-11).padStart(11, "0");
let token = "";
let userId = 0;
let gameId = 0;
const adminEmail = `admin${suffix}@forja.local`;
let app: (typeof import("../src/server"))["app"];
let prisma: (typeof import("../config/prisma"))["prisma"];

test.before(async () => {
    process.env.JWT_SECRET ??= "test-secret-that-is-long-enough";
    ({ app } = await import("../src/server.js"));
    ({ prisma } = await import("../config/prisma.js"));
});

test("health check", async () => {
    const response = await request(app).get("/");
    assert.equal(response.status, 200);
    assert.equal(response.body.status, "ok");
});

test("cadastro, login e rota protegida", async () => {
    const cadastro = await request(app).post("/cadastro").send({
        nome: "Usuario Teste",
        email,
        cpf,
        senha: "senha123",
    });
    assert.equal(cadastro.status, 201);
    assert.equal(typeof cadastro.body, "string");
    token = cadastro.body;
    const user = await prisma.funcionario.findUnique({ where: { email } });
    assert.ok(user);
    userId = user.id;

    const login = await request(app).post("/login").send({
        email,
        senha: "senha123",
    });
    assert.equal(login.status, 200);

    const me = await request(app)
        .get("/me")
        .set("Authorization", `Bearer ${token}`);
    assert.equal(me.status, 200);
    assert.equal(me.body.email, email);

    const update = await request(app)
        .put(`/funcionarios/${userId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ nome: "Nome Atualizado" });
    assert.equal(update.status, 200);
    assert.equal(update.body.nome, "Nome Atualizado");

    const roleUpdate = await request(app)
        .put(`/funcionarios/${userId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ cargo: "ADMIN" });
    assert.equal(roleUpdate.status, 403);
});

test("catalogo, lista de desejos e biblioteca", async () => {
    const game = await prisma.jogo.create({
        data: {
            titulo: `Jogo de teste ${suffix}`,
            descricao: "Registro usado pelo teste automatizado",
            genero: "Aventura",
            plataforma: "PC",
            preco: 0,
        },
    });
    gameId = game.id;

    const catalog = await request(app).get("/jogos");
    assert.equal(catalog.status, 200);
    assert.ok(catalog.body.some((item: { id: number }) => item.id === gameId));

    const addWishlist = await request(app)
        .post(`/desejos/${gameId}`)
        .set("Authorization", `Bearer ${token}`);
    assert.equal(addWishlist.status, 201);
    const duplicateWishlist = await request(app)
        .post(`/desejos/${gameId}`)
        .set("Authorization", `Bearer ${token}`);
    assert.equal(duplicateWishlist.status, 409);

    const wishlist = await request(app)
        .get("/desejos")
        .set("Authorization", `Bearer ${token}`);
    assert.equal(wishlist.status, 200);
    assert.ok(wishlist.body.some((item: { jogoId: number }) => item.jogoId === gameId));

    const addLibrary = await request(app)
        .post(`/biblioteca/${gameId}`)
        .set("Authorization", `Bearer ${token}`);
    assert.equal(addLibrary.status, 201);

    const invalidLibraryUpdate = await request(app)
        .put(`/biblioteca/${gameId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ horasJogadas: -1 });
    assert.equal(invalidLibraryUpdate.status, 400);

    const libraryUpdate = await request(app)
        .put(`/biblioteca/${gameId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ horasJogadas: 2.5, status: "EM_ANDAMENTO", conquistas: 1 });
    assert.equal(libraryUpdate.status, 200);
    assert.equal(libraryUpdate.body.horasJogadas, 2.5);

    const library = await request(app)
        .get("/biblioteca")
        .set("Authorization", `Bearer ${token}`);
    assert.equal(library.status, 200);
    assert.ok(library.body.some((item: { jogoId: number }) => item.jogoId === gameId));

    const removeWishlist = await request(app)
        .delete(`/desejos/${gameId}`)
        .set("Authorization", `Bearer ${token}`);
    assert.equal(removeWishlist.status, 200);
    const removeLibrary = await request(app)
        .delete(`/biblioteca/${gameId}`)
        .set("Authorization", `Bearer ${token}`);
    assert.equal(removeLibrary.status, 200);
});

test("login invalido e token ausente", async () => {
    const login = await request(app).post("/login").send({
        email,
        senha: "senha-incorreta",
    });
    assert.equal(login.status, 401);

    const me = await request(app).get("/me");
    assert.equal(me.status, 401);

    const forbiddenAdminRoute = await request(app)
        .get("/funcionarios")
        .set("Authorization", `Bearer ${token}`);
    assert.equal(forbiddenAdminRoute.status, 403);
});

test("permissoes administrativas para funcionarios e jogos", async () => {
    const admin = await prisma.funcionario.create({
        data: {
            nome: "Admin de teste",
            email: adminEmail,
            cpf: `${Date.now() + 1}`.slice(-11).padStart(11, "1"),
            senha: await bcrypt.hash("Senha-admin-teste-123", 10),
            cargo: "ADMIN",
        },
    });
    const adminToken = jwt.sign(
        { id: admin.id, cargo: admin.cargo },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" },
    );

    const employees = await request(app)
        .get("/funcionarios")
        .set("Authorization", `Bearer ${adminToken}`);
    assert.equal(employees.status, 200);
    assert.ok(employees.body.some((employee: { id: number }) => employee.id === userId));

    const game = await request(app)
        .post("/jogos")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
            titulo: `Jogo admin ${suffix}`,
            descricao: "Criado no teste automatizado",
            genero: "Aventura",
            plataforma: "PC",
            preco: 10,
        });
    assert.equal(game.status, 201);
    await prisma.jogo.delete({ where: { id: game.body.id } });
    await prisma.funcionario.delete({ where: { id: admin.id } });
});

test.after(async () => {
    if (prisma) {
        if (gameId) {
            await prisma.jogo.deleteMany({ where: { id: gameId } });
        }
        await prisma.funcionario.deleteMany({ where: { email: adminEmail } });
        await prisma.funcionario.deleteMany({ where: { email } });
        await prisma.$disconnect();
    }
});
