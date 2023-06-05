import { api } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

// função para pegar o código do github na url
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  // coleta o token redirectTo, se existir.
  const redirectTo = request.cookies.get("redirectTo")?.value;

  // faz uma requisição para o back enviando o code do github
  const registerResponse = await api.post("/register", {
    code,
  });

  const { token } = registerResponse.data;

  // define a url que o usuário será redirecionado após fazer login
  // se existir redirectTo será redirecionado para redirectTo. senão, para a home
  const redirectURL = redirectTo ?? new URL("/", request.url);

  // define o tempo de expiração dos cookies para 30 dias
  const cookieExpiresInSeconds = 60 * 60 * 24 * 30;

  // redireciona o usuário para a página raíz,
  // salva o token do github nos cookies, diz
  // que ele ficará disponível em todo o "path=/",
  // ou seja, em toda a aplicação e seta o tempo
  // de expiração do cookie para 30 dias
  return NextResponse.redirect(redirectURL, {
    headers: {
      "Set-Cookie": `token=${token}; Path=/; max-age=${cookieExpiresInSeconds}`,
    },
  });
}
