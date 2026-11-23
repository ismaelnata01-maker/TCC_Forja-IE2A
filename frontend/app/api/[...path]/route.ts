import { NextRequest, NextResponse } from "next/server";

async function proxy(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const apiUrl = process.env.API_URL ?? "http://127.0.0.1:3333";
  const body = request.method === "GET" || request.method === "HEAD" ? undefined : await request.text();
  const headers = new Headers({ "Content-Type": "application/json" });
  const cookie = request.headers.get("cookie");
  if (cookie) headers.set("cookie", cookie);
  const tokenMatch = cookie?.match(/(?:^|;\s*)@gestao-escolar\/token=([^;]+)/);
  if (tokenMatch?.[1]) headers.set("Authorization", `Bearer ${decodeURIComponent(tokenMatch[1])}`);

  try {
    const response = await fetch(`${apiUrl}/${path.join("/")}`, {
      method: request.method,
      headers,
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
    if (response.ok && path.join("/") === "logout") {
      nextResponse.cookies.delete("@gestao-escolar/token");
    }
    return nextResponse;
  } catch {
    return NextResponse.json("Não foi possível conectar ao servidor", { status: 502 });
  }
}

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxy(request, context);
}

export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxy(request, context);
}

export async function PUT(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxy(request, context);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxy(request, context);
}
