import { FastifyReply, FastifyRequest } from "fastify";
import {
  AdvisorParams,
  AdvisorsFilters,
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
  const { name, registration, email } = req.body;

  const advisor = await prisma.advisor.create({
    data: {
      name,
      registration,
      email,
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
  const { name, registration, email } = req.body;
  const { id } = req.params;

  const advisor = await prisma.advisor.findUnique({
    where: {
      id,
    },
  });
  if (!advisor) {
    return await reply.code(404).send({
      message: "Advisor not found",
    });
  }

  await prisma.advisor.update({
    where: {
      id,
    },
    data: {
      ...(name && { name }),
      ...(registration && { registration }),
      ...(email && { email }),
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
  const search = req.query.search || "";
  const orderBy = req.query.orderBy || "name";
  const sort = (req.query.sort || "desc") as "asc" | "desc";

  const searchConditions: AdvisorsFilters = {
    OR: [
      {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        registration: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        email: {
          contains: search,
          mode: "insensitive",
        },
      },
    ],
  };

  const [advisors, total] = await prisma.$transaction([
    prisma.advisor.findMany({
      where: searchConditions,
      take,
      skip,
      select: {
        id: true,
        name: true,
        registration: true,
        email: true,
      },
      orderBy: {
        [orderBy]: sort,
      },
    }),
    prisma.advisor.count({
      where: searchConditions,
    }),
  ]);

  const totalPages = take ? Math.ceil(total / take) : 1;

  return (await reply.code(200).send({
    advisors,
    total,
    totalPages,
  })) as GetAdvisorResponse;
}

export async function getAdvisorsNames(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const advisorsNames = await prisma.advisor.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return await reply.code(200).send(advisorsNames);
}
