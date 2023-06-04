import { cookies } from "next/headers";
import decode from "jwt-decode";

interface User {
  sub: string;
  name: string;
  avatarUrl: string;
}

export function getUser(): User {
  // coleta o cookie "token" dos cookies
  const token = cookies().get("token")?.value;

  // se ele não existir é pq o usuário não está autenticado. dái gerará um erro
  if (!token) {
    throw new Error("Unauthenticated");
  }

  // decodifica o token para coletar os dados
  const user: User = decode(token);

  return user;
}
