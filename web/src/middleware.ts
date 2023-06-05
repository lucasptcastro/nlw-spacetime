import { NextRequest, NextResponse } from "next/server";

const signInUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}`;

export function middleware(request: NextRequest) {
  // verifica se o usuário está logado
  const token = request.cookies.get("token")?.value;

  // se não estiver logado, vai ser redirecionado para a página de login
  // request.url -> pega a url atual em que o usuário está
  // HttpOnly -> faz com que o token não fique visível para o usuário e também não habilita para o JavaScript
  if (!token) {
    return NextResponse.redirect(signInUrl, {
      headers: {
        "Set-Cookie": `redirectTo=${request.url}; Path=/; HttpOnly; max-age=20`,
      },
    });
  }

  // se estiver logado, não faz nada
  return NextResponse.next();
}

// define quais as rotas que o middleware será ativado quando o usuário tentar acessar
export const config = {
  matcher: "/memories/:path*",
};
