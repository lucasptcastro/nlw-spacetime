import { z } from "zod";
import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

// Neste arquivo ficará todas os métodos HTTPS que forem relacionados as memories

export async function memoriesRoutes(app: FastifyInstance) {
  // antes de executar as rotas, vai verificar se o usuário está logado
  app.addHook("preHandler", async (request) => {
    await request.jwtVerify();
  });

  // lista todos os campos ordenados pela data de criação em ordem decrescente da tabela "memory"
  app.get("/memories", async (request) => {
    // verifica se quando o usuário acessar a rota, ele está com o token jwt. Caso contrário,
    // bloqueia para que não consiga acessar a rota. Só pode acessar se tiver logado
    await request.jwtVerify();

    const memories = await prisma.memory.findMany({
      where: {
        userId: request.user.sub,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // retora o id, a url e o resumo da memória (o "content" da memória com no máximo 115 caracteres concatenado com "...")
    return memories.map((memory) => {
      return {
        id: memory.id,
        coverUrl: memory.coverUrl,
        excerpt: memory.content.substring(0, 115).concat("..."),
      };
    });
  });

  // lista uma memória em específico
  app.get("/memories/:id", async (request, reply) => {
    // coleta um objeto ( que será o id ) e verifica se ele é uma string e um UUID
    const paramsSchema = z.object({ id: z.string().uuid() });

    // coleta o id que está dentro de um objeto e insere no "paramsSchema" para ver se ele passa nas validações
    const { id } = paramsSchema.parse(request.params);

    // coleta o primeiro dado onde o id da tabela é igual ao id coletado na URL, caso contrário (o id não seja encontrado) gera um erro
    const memory = await prisma.memory.findFirstOrThrow({
      where: {
        id,
      },
    });

    // se a memória não for pública e o id do usuário for diferente
    // do usuário da memória, retorna um erro
    if (!memory.isPublic && memory.userId !== request.user.sub) {
      return reply.status(401).send();
    }

    return memory;
  });

  // cria uma memória
  app.post("/memories", async (request) => {
    // bodySchema -> coleta os valores e faz a velidação

    // isPublic: z.coerce.boolean() -> verifica se o valor é comparável a false ou true, ou seja, se o valor
    // for 0, "", null, undefined ele será false. Se for 1, "dasdasda" será true. Pois nem todas as requisições
    // recebem true ou false
    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    });

    // coleta os valores que estarãoo dentro de um objeto e insere no "bodySchema"
    const { content, coverUrl, isPublic } = bodySchema.parse(request.body);

    // insere os campos no banco de dados
    const memory = await prisma.memory.create({
      data: {
        content,
        coverUrl,
        isPublic,
        userId: request.user.sub,
      },
    });

    return memory;
  });

  // atualiza uma memória
  app.put("/memories/:id", async (request, reply) => {
    const paramsSchema = z.object({ id: z.string().uuid() });
    const { id } = paramsSchema.parse(request.params);

    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    });
    const { content, coverUrl, isPublic } = bodySchema.parse(request.body);

    let memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    });

    // se o id do usuário for diferente do usuário da memória, retorna um erro
    if (memory.userId !== request.user.sub) {
      return reply.status(401).send();
    }

    // atualiza o content, coverUrl, isPublic onde o id passado na requisição for o mesmo da tabela memory
    memory = await prisma.memory.update({
      where: {
        id,
      },
      data: {
        content,
        coverUrl,
        isPublic,
      },
    });

    return memory;
  });

  // deleta uma memória
  app.delete("/memories/:id", async (request, reply) => {
    const paramsSchema = z.object({ id: z.string().uuid() });

    const { id } = paramsSchema.parse(request.params);

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    });

    // se o id do usuário for diferente do usuário da memória, retorna um erro
    if (memory.userId !== request.user.sub) {
      return reply.status(401).send();
    }

    await prisma.memory.delete({
      where: {
        id,
      },
    });
  });
}
