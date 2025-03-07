import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";


export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });


  if (!token) {
    // Redirecionar para a página de login se não houver token
    return NextResponse.redirect(new URL("/login", request.url));
  }


  // Se houver um token, permitir o acesso à rota
  return NextResponse.next();
}


// Configurar em quais caminhos o middleware deve ser executado
export const config = {
  matcher: [
    "/dashboard",
    "/minhas-operacoes",
    "/desempenho",
    "/parceiros",
    // Adicione aqui outras rotas que você quer proteger
  ],
};