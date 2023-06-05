import { randomUUID } from "node:crypto";
import { extname, resolve } from "node:path";
import { FastifyInstance } from "fastify";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream";
import { promisify } from "node:util";

const pump = promisify(pipeline);

export async function uploadRoutes(app: FastifyInstance) {
  // rota para enviar um arquivo (que será imagem ou video)
  app.post("/upload", async (request, reply) => {
    const upload = await request.file({
      limits: {
        fileSize: 5_242_880, // 5mb
      },
    });

    if (!upload) {
      return reply.status(400).send();
    }

    const mimeTypeRegex = /^(image|video)\/[a-zA-Z]+/;
    const isValidFileFormat = mimeTypeRegex.test(upload.mimetype);

    if (!isValidFileFormat) {
      return reply.status(400).send();
    }

    // irá gerar um UUID e concatenar com o nome do arquivo para gerar um novo nome para o arquivo.
    // evitando assim que usuários upem arquivos com o mesmo nome e eles sejam substituídos
    const fileId = randomUUID();
    const extension = extname(upload.filename);
    const fileName = fileId.concat(extension);

    // escreve os upload na pasta indicada como o nome indicado
    // dirname -> caminho em que está o arquivo atual
    const writeStream = createWriteStream(
      resolve(__dirname, "../../uploads/", fileName)
    );

    await pump(upload.file, writeStream);

    // cria uma URL para o arquivo, pegando o tipo de protocolo (http, https) + :// + o host da aplicação
    // e concatena com /uploads/nome do arquivo
    const fullUrl = request.protocol.concat("://").concat(request.hostname);
    const fileUrl = new URL(`/uploads/${fileName}`, fullUrl);

    return { fileUrl };
  });
}
