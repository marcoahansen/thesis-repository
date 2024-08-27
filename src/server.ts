import fastify, { type FastifyReply, type FastifyRequest } from 'fastify'
import cors from '@fastify/cors'
import fjwt, { type FastifyJWT } from '@fastify/jwt'
import fCookie from '@fastify/cookie'
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { userRoutes } from './modules/user/user.routes'
import { env } from './env'
import { thesisRoutes } from './modules/thesis/thesis.routes'

const app = fastify()

app.register(fjwt, { secret: env.JWT_SECRET })
app.addHook('preHandler', (req, res, next) => {
  req.jwt = app.jwt
  next()
})

app.decorate(
  'authenticate',
  async (req: FastifyRequest, reply: FastifyReply) => {
    const token = req.cookies.access_token
    if (!token) {
      return await reply
        .status(401)
        .send({ message: 'Authentication required' })
    }
    const decoded = req.jwt.verify<FastifyJWT['user']>(token)
    req.user = decoded
  },
)

app.register(fCookie, {
  secret: env.JWT_SECRET,
  hook: 'preHandler',
})

app.register(cors, {
  origin: '*',
})

app.get('/healthcheck', (req, res) => {
  res.send({ message: 'Success' })
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(thesisRoutes, { prefix: 'api/theses' })
app.register(userRoutes, { prefix: 'api/users' })

app.listen({ port: env.PORT }).then(() => {
  console.log('Server running!')
})

const listeners = ['SIGINT', 'SIGTERM']
listeners.forEach((signal) => {
  process.on(signal, async () => {
    await app.close()
    process.exit(0)
  })
})
