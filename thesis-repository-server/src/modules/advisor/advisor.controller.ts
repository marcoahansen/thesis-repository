import { FastifyReply, FastifyRequest } from "fastify";
import {
  AdvisorParams,
  CreateAdvisorInput,
  GetAdvisorQuery,
  GetAdvisorResponse,
  UpdateAdvisorInput,
} from "./advisor.schema";
import { prisma } from "../../lib/prisma";

export async function createAdvisor(
  req: FastifyRequest<{
    Body: CreateAdvisorInput;
  }>,
  reply: FastifyReply
) {
  const { name, registration } = req.body;

  const advisor = await prisma.advisor.create({
    data: {
      name,
      registration,
    },
  });

  return await reply.code(201).send(advisor);
}

export async function updateAdvisor(
  req: FastifyRequest<{
    Body: UpdateAdvisorInput;
    Params: AdvisorParams;
  }>,
  reply: FastifyReply
) {
  const { name, registration } = req.body;
  const { id } = req.params;

  const advisor = await prisma.advisor.update({
    where: {
      id,
    },
    data: {
      name,
      registration,
    },
  });

  return await reply.send(advisor);
}

export async function deleteAdvisor(
  req: FastifyRequest<{
    Params: AdvisorParams;
  }>,
  reply: FastifyReply
) {
  const { id } = req.params;

  await prisma.advisor.delete({
    where: {
      id,
    },
  });

  return await reply.send({ message: "Advisor deleted" });
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

export async function getAdvisors(
  req: FastifyRequest<{
    Querystring: GetAdvisorQuery;
  }>,
  reply: FastifyReply
) {
  const skip = Number(req.query.skip) || 0;
  const take = Number(req.query.take) || 20;

  const [advisors, total] = await prisma.$transaction([
    prisma.advisor.findMany({
      take,
      skip,
      select: {
        id: true,
        name: true,
        registration: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
    prisma.advisor.count(),
  ]);

  const totalPages = take ? Math.ceil(total / take) : 1;

  return (await reply.code(200).send({
    advisors,
    total,
    totalPages,
  })) as GetAdvisorResponse;
}
