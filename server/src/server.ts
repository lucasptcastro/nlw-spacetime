import fastify from "fastify";
import cors from "@fastify/cors";
import { memoriesRoutes } from "./routes/memories";

// fastify -> serve para criar rotas HTTPS

const app = fastify();

app.register(cors, {
  origin: true, // -> indica que qualquer front-end pode acessar a api (não é indicado)
  // origin: ["http://localhost:3333", "http://rocketseat.com.br/api"] -> indica qual/quais front-ends podem acessar a api (medida de segurança)
});

app.register(memoriesRoutes);

app.listen({ port: 3333 }).then(() => {
  console.log("🚀 HTTP server running on http://localhost:3333");
});
