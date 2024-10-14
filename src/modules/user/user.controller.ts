import { type FastifyReply, type FastifyRequest } from "fastify";
import {
  GetUsersQuery,
  GetUsersResponse,
  UpdateUserInput,
  UsersFilters,
  type CreateUserInput,
  type LoginUserInput,
} from "./user.schema";
import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma";

const SALT_ROUNDS = 10;

export async function createUser(
  req: FastifyRequest<{
    Body: CreateUserInput;
  }>,
  reply: FastifyReply
) {
  const { password, email, name, registration } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (user) {
    return await reply.code(401).send({
      message: "User already exists with this email",
    });
  }
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await prisma.user.create({
      data: {
        password: hash,
        email,
        name,
        registration,
      },
    });
    return await reply.code(201).send(user);
  } catch (e) {
    return await reply.code(500).send(e);
  }
}

export async function updateUser(
  req: FastifyRequest<{
    Body: UpdateUserInput;
  }>,
  reply: FastifyReply
) {
  const { password, name } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
  });

  if (!user) {
    return await reply.code(401).send({
      message: "User not found",
    });
  }

  let hash: string | undefined = undefined;
  if (password) {
    hash = await bcrypt.hash(password, SALT_ROUNDS);
  }

  await prisma.user.update({
    where: {
      id: req.user.id,
    },
    data: {
      ...(hash && { password: hash }),
      ...(name && { name }),
    },
  });

  return await reply.code(200).send({ message: "User updated successfully" });
}

export async function deleteUser(
  req: FastifyRequest<{
    Params: { id: string };
  }>,
  reply: FastifyReply
) {
  const { id } = req.params;

  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    return await reply.code(404).send({ message: "User not found" });
  }

  await prisma.user.delete({ where: { id } });
  return await reply.send({ message: "User deleted successfully" });
}

export async function login(
  req: FastifyRequest<{
    Body: LoginUserInput;
  }>,
  reply: FastifyReply
) {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  const isMatch = user && (await bcrypt.compare(password, user.password));
  if (!user || !isMatch) {
    return await reply.code(401).send({
      message: "Invalid email or password",
    });
  }
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
  };
  const token = req.jwt.sign(payload);
  reply.setCookie("access_token", token, {
    path: "/",
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24 * 7,
  });
  return { accessToken: token, user: payload };
}

export async function me(req: FastifyRequest, reply: FastifyReply) {
  return await reply.send(req.user);
}

export async function getUsers(
  req: FastifyRequest<{
    Querystring: GetUsersQuery;
  }>,
  reply: FastifyReply
) {
  const skip = Number(req.query.skip) || 0;
  const take = Number(req.query.take) || 20;
  const search = req.query.search || "";
  const orderBy = req.query.orderBy || "name";
  const sort = (req.query.sort || "desc") as "asc" | "desc";

  const searchConditions: UsersFilters = {
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

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
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
    prisma.user.count({
      where: searchConditions,
    }),
  ]);

  const totalPages = take ? Math.ceil(total / take) : 1;

  return (await reply.code(200).send({
    users,
    total,
    totalPages,
  })) as GetUsersResponse;
}

export async function logout(req: FastifyRequest, reply: FastifyReply) {
  reply.clearCookie("access_token");
  return await reply.send({ message: "Logout successful" });
}
