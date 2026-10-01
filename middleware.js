import { NextResponse } from "next/server";
import { lerSessao } from "@/lib/sessao";

// Caminhos liberados sem login.
const PUBLICOS = ["/login", "/register", "/api/login", "/api/register"];

function ehRotaAdmin(pathname) {
  return pathname === "/usuarios" || pathname.startsWith("/api/usuarios");
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (PUBLICOS.includes(pathname)) {
    return NextResponse.next();
  }

  const sessao = await lerSessao(request.cookies.get("sessao")?.value);

  // Sem sessão válida: API responde 401; páginas caem no login.
  if (!sessao) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ mensagem: "Não autenticado." }, { status: 401 });
    }
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Área de usuários é só para admin.
  if (ehRotaAdmin(pathname) && sessao.role !== "admin") {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ mensagem: "Acesso restrito." }, { status: 403 });
    }
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
