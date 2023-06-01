import fastify from 'fastify'
import { PrismaClient } from '@prisma/client'

// fastify -> serve para criar rotas HTTPS
// prisma -> conexão com a api
const app = fastify()
const prisma = new PrismaClient()

app.get('/users', async () => {
  const users = await prisma.user.findMany() // lista todos os usuários na rota /users

  return users
})

app.listen({ port: 3333 }).then(() => {
  console.log('🚀 HTTP server running on http://localhost:3333')
})
