import "dotenv/config";

import fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { memoriesRoutes } from "./routes/memories";
import { authRoutes } from "./routes/auth";

// fastify -> serve para criar rotas HTTPS
const app = fastify();

// "origin: true" -> indica que qualquer front-end pode acessar a api (não é indicado)
// origin: ["http://localhost:3333", "http://rocketseat.com.br/api"] -> indica qual/quais front-ends podem acessar a api (medida de segurança)
app.register(cors, {
  origin: true,
});

// jwt é uma forma de guardar dados temporários na web
// "secret" -> é a criptografia do token. é bom colocar caracteres aleatórios. Ex.: "daidashdhashdsanfsdhbfauyosghfaushfsakdjlfbnsaç"
app.register(jwt, {
  secret: "spacetime",
});

app.register(authRoutes);
app.register(memoriesRoutes);

app.listen({ port: 3333 }).then(() => {
  console.log("🚀 HTTP server running on http://localhost:3333");
});
