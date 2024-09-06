import { type FastifyReply, type FastifyRequest } from "fastify";
import {
  UpdateUserInput,
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
  const { password, email, name } = req.body;
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

  const updatedUser = await prisma.user.update({
    where: {
      id: req.user.id,
    },
    data: {
      ...(hash && { password: hash }),
      ...(name && { name }),
    },
  });

  return await reply.code(200).send(updatedUser);
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
  });
  return { accessToken: token };
}

export async function getUsers(req: FastifyRequest, reply: FastifyReply) {
  const users = await prisma.user.findMany({
    select: {
      name: true,
      id: true,
      email: true,
    },
  });
  return await reply.code(200).send(users);
}

export async function logout(req: FastifyRequest, reply: FastifyReply) {
  reply.clearCookie("access_token");
  return await reply.send({ message: "Logout successful" });
}
