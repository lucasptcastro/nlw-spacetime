import { NextRequest, NextResponse } from "next/server";

// função para pegar o código do github na url
export async function GET(request: NextRequest) {
  // define a url que o usuário será redirecionado
  // após fazer login
  const redirectURL = new URL("/", request.url);

  // redireciona o usuário para a página raíz,
  // salva o token do github nos cookies, diz
  // que ele ficará disponível em todo o "path=/",
  // ou seja, em toda a aplicação e seta o tempo
  // de expiração do cookie para 30 dias
  return NextResponse.redirect(redirectURL, {
    headers: {
      "Set-Cookie": `token=; Path=/; max-age=0`,
    },
  });
}
