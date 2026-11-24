"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const email = formData.get("email");
  const senha = formData.get("senha");

  let response: Response;
  try {
    response = await fetch(`${process.env.API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        senha,
      }),
    });
  } catch (e) {
    console.error(e);
    return "Erro ao comunicar com o servidor";
  }

  const data = await response.json();

  if (response.status !== 200) {
    return data;
  }

  const cookieStore = await cookies();
  cookieStore.set("@gestao-escolar/token", data);
  redirect("/dashboard");
}

export async function cadastrar(formData: FormData) {
  const cargo = "FUNCIONARIO";
  const nome = formData.get("nome");
  const email = formData.get("email");
  const cpf = formData.get("cpf");
  const senha = formData.get("senha");
  const telefone = formData.get("telefone");
  const nascimento = formData.get("nascimento");
  const endereco = formData.get("endereco");

  let response: Response;
  try {
    response = await fetch(`${process.env.API_URL}/cadastro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome,
        email,
        cargo,
        cpf,
        senha,
        telefone,
        nascimento,
        endereco,
      }),
    });
  } catch (e) {
    console.error(e);
    return "Erro ao comunicar com o servidor";
  }

  const data = await response.json();
  if (!response.ok) {
    return typeof data === "string" ? data : "Não foi possível realizar o cadastro";
  }

  const cookieStore = await cookies();
  cookieStore.set("@gestao-escolar/token", data);
  redirect("/dashboard");
}