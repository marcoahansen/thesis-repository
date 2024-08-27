import { type FastifyInstance } from 'fastify'
import { type ZodTypeProvider } from 'fastify-type-provider-zod'

import {
  createUserResponseSchema,
  createUserSchema,
  loginResponseSchema,
  loginSchema,
} from './user.schema'
import { createUser, getUsers, login, logout } from './user.controller'

export async function userRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [app.authenticate],
    },
    getUsers,
  )
  app.withTypeProvider<ZodTypeProvider>().post(
    '/register',
    {
      schema: {
        body: createUserSchema,
        response: {
          201: createUserResponseSchema,
        },
      },
    },
    createUser,
  )
  app.withTypeProvider<ZodTypeProvider>().post(
    '/login',
    {
      schema: {
        body: loginSchema,
        response: {
          201: loginResponseSchema,
        },
      },
    },
    login,
  )
  app.delete('/logout', { preHandler: [app.authenticate] }, logout)
  app.log.info('user routes registered')
}
