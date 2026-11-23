import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const apiUrl = process.env.API_URL ?? "http://127.0.0.1:3333";
  const body = await request.text();

  try {
    const response = await fetch(`${apiUrl}/${path.join("/")}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    const text = await response.text();
    const nextResponse = new NextResponse(text, {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok && path.join("/") === "login") {
      const token = text.replaceAll("\"", "");
      nextResponse.cookies.set("@gestao-escolar/token", token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
      });
    }
    return nextResponse;
  } catch {
    return NextResponse.json("Não foi possível conectar ao servidor", { status: 502 });
  }
}
