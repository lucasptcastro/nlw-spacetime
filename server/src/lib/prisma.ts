import { PrismaClient } from "@prisma/client";

// prisma -> conexão com a api
export const prisma = new PrismaClient({
  log: ["query"], // cria logs para cada chamada no banco de dados
});
