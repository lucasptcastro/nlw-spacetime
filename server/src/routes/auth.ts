import { FastifyInstance } from "fastify";
import axios from "axios";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function authRoutes(app: FastifyInstance) {
  app.post("/register", async (request) => {
    const bodySchema = z.object({
      code: z.string(),
    });

    // verifica se o id que está sendo enviado é uma string
    const { code } = bodySchema.parse(request.body);

    // faz uma requisição ao github para enviar os códigos do usuário
    // e receber o acessToken para coletar dados da conta do usuário
    const accessTokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      null,
      {
        params: {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        headers: {
          Accept: "application/json",
        },
      }
    );

    const { access_token } = accessTokenResponse.data;

    // faz uma requisição ao github para coletar os dados da conta do usuário
    // passando o bearer token como autorização
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    // valida os campos que serão retornados do userResponse
    const userSchema = z.object({
      id: z.number(),
      login: z.string(),
      name: z.string(),
      avatar_url: z.string().url(),
    });

    const userInfo = userSchema.parse(userResponse.data);

    // verifica se o usuário já existe no banco
    let user = await prisma.user.findUnique({
      where: {
        githubId: userInfo.id,
      },
    });

    // se o usuário não existir no banco, cria-se um novo
    if (!user) {
      user = await prisma.user.create({
        data: {
          githubId: userInfo.id,
          login: userInfo.login,
          name: userInfo.name,
          avatarUrl: userInfo.avatar_url,
        },
      });
    }

    // colocar apenas informações públicas no token. NÃO colocar
    // informações sensíveis.
    // primeiro objeto: coloca os dados que quer guardar no token
    // segundo objeto: coloca alguma informção única para saber a qual
    // usuário as informações pertencem. E quanto tempo vai levar para o token expirar
    const token = app.jwt.sign(
      {
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
      {
        sub: user.id,
        expiresIn: "30 days",
      }
    );

    return {
      token,
    };
  });
}
