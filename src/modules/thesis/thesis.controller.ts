import { type FastifyReply, type FastifyRequest } from 'fastify'
import { prisma } from '../../lib/prisma'
import { type CreateThesisInput } from './thesis.schema'

export async function createThesis(
  req: FastifyRequest<{
    Body: CreateThesisInput
  }>,
  reply: FastifyReply,
) {
  const { title, year, keywords, filePath, author_name, advisor_name } =
    req.body

  const keywordsArray = keywords.map((keyword) => keyword)

  const thesis = await prisma.thesis.create({
    data: {
      title,
      year,
      filePath,
      keywords: keywordsArray,
      author: {
        create: {
          name: author_name,
          advisor: {
            create: {
              name: advisor_name,
            },
          },
        },
      },
    },
  })

  return await reply.code(201).send(thesis)
}

export async function getThesis(req: FastifyRequest, reply: FastifyReply) {
  const thesis = await prisma.thesis.findMany({
    select: {
      id: true,
      title: true,
      year: true,
      filePath: true,
      keywords: true,
      author: {
        select: {
          name: true,
          advisor: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  })
  return await reply.code(200).send(thesis)
}
