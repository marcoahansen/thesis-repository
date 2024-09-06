import { type FastifyReply, type FastifyRequest } from "fastify";
import { prisma } from "../../lib/prisma";
import {
  GetThesisQuery,
  ThesisParams,
  UpdateThesisInput,
  type CreateThesisInput,
} from "./thesis.schema";

export async function createThesis(
  req: FastifyRequest<{
    Body: CreateThesisInput;
  }>,
  reply: FastifyReply
) {
  const { title, year, keywords, filePath, author_name, advisor_name } =
    req.body;

  const keywordsArray = keywords.map((keyword) => keyword);

  let advisor = await prisma.advisor.findUnique({
    where: {
      name: advisor_name,
    },
  });

  if (!advisor) {
    advisor = await prisma.advisor.create({
      data: {
        name: advisor_name,
      },
    });
  }

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
            connect: {
              id: advisor.id,
            },
          },
        },
      },
    },
  });

  return await reply.code(201).send(thesis);
}

export async function updateThesis(
  req: FastifyRequest<{
    Params: ThesisParams;
    Body: UpdateThesisInput;
  }>,
  reply: FastifyReply
) {
  const { id } = req.params;
  const { title, year, keywords, filePath, author_name, advisor_name } =
    req.body;

  try {
    const thesis = await prisma.thesis.findUnique({
      where: { id },
    });

    if (!thesis) {
      return reply.code(404).send({ message: "Thesis not found" });
    }

    let advisor = null;
    if (advisor_name) {
      advisor = await prisma.advisor.findUnique({
        where: { name: advisor_name },
      });

      if (!advisor) {
        advisor = await prisma.advisor.create({
          data: { name: advisor_name },
        });
      }
    }

    const updatedThesis = await prisma.thesis.update({
      where: { id },
      data: {
        title,
        year,
        filePath,
        keywords: keywords ? { set: keywords } : undefined,
        author: {
          update: {
            name: author_name,
            advisor: advisor ? { connect: { id: advisor.id } } : undefined,
          },
        },
      },
    });

    return reply.code(200).send(updatedThesis);
  } catch (error) {
    console.error(error);
    return reply.code(500).send({ message: "Failed to update thesis" });
  }
}

export async function deleteThesis(
  req: FastifyRequest<{
    Params: ThesisParams;
  }>,
  reply: FastifyReply
) {
  const { id } = req.params;

  try {
    const thesis = await prisma.thesis.delete({
      where: { id },
    });

    return reply.code(200).send(thesis);
  } catch (error) {
    console.error(error);
    return reply.code(500).send({ message: "Failed to delete thesis" });
  }
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
  });
  return await reply.code(200).send(thesis);
}

export async function getThesisByKeywords(
  req: FastifyRequest<{
    Params: GetThesisQuery;
  }>,
  reply: FastifyReply
) {
  const { keywords } = req.params;

  const keywordsArray = decodeURIComponent(keywords).split(",");

  const thesis = await prisma.thesis.findMany({
    where: {
      keywords: {
        hasSome: keywordsArray,
      },
    },
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
  });
  return await reply.code(200).send(thesis);
}

export async function getTopAdvisors(req: FastifyRequest, reply: FastifyReply) {
  const topAdvisors = await prisma.advisor.findMany({
    select: {
      name: true,
      _count: {
        select: {
          authors: true,
        },
      },
    },
    orderBy: {
      authors: {
        _count: "desc",
      },
    },
    take: 10,
  });

  return await reply.code(200).send(topAdvisors);
}
