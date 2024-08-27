import { type FastifyInstance } from 'fastify'
import { type ZodTypeProvider } from 'fastify-type-provider-zod'
import { createThesisResponseSchema, createThesisSchema } from './thesis.schema'
import { createThesis, getThesis } from './thesis.controller'

export async function thesisRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/register',
    {
      preHandler: [app.authenticate],
      schema: {
        body: createThesisSchema,
        response: {
          201: createThesisResponseSchema,
        },
      },
    },
    createThesis,
  )
  app.withTypeProvider<ZodTypeProvider>().get('/', getThesis)
}
