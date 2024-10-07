/* eslint-disable @typescript-eslint/no-misused-promises */
import { type FastifyInstance } from 'fastify'
import { ClientError } from './errors/client-error'
import { ZodError } from 'zod'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({ message: error.errors[0].message })
  }

  if (error instanceof ClientError) {
    return reply.status(400).send({ message: error.message })
  }

  return reply.status(500).send({ message: 'Internal Server Error' })
}
