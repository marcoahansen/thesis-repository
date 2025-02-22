import { type FastifyReply, type FastifyRequest } from "fastify";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

import { prisma } from "../../lib/prisma";
import { r2 } from "../../lib/cloudflare";

import {
  GetThesisQuery,
  GetThesisResponse,
  ThesisFilters,
  ThesisParams,
  UpdateThesisInput,
  type CreateThesisInput,
} from "./thesis.schema";
import { env } from "../../env";
import { randomBytes } from "crypto";
import { promisify } from "util";
import { isYear, validateYear } from "../../utils/functions";
const randomBytesAsync = promisify(randomBytes);

export async function getUploadUrl(
  req: FastifyRequest<{
    Body: { fileName: string };
  }>,
  reply: FastifyReply
) {
  const { fileName } = req.body;
  const rawBytes = await randomBytesAsync(8);
  const randomString = rawBytes.toString("hex");
  const keyFile = randomString + fileName;

  const signedUrl = await getSignedUrl(
    r2,
    new PutObjectCommand({
      Bucket: env.BUCKET_NAME,
      Key: keyFile,
      ContentType: "text/csv",
    }),
    { expiresIn: 600 }
  );

  return await reply.code(201).send({
    key: keyFile,
    url: signedUrl,
  });
}

export async function deleteFile(
  req: FastifyRequest<{
    Params: { key: string };
  }>,
  reply: FastifyReply
) {
  const { key } = req.params;

  try {
    await r2.send(
      new DeleteObjectCommand({
        Bucket: env.BUCKET_NAME,
        Key: key,
      })
    );

    return await reply.code(200).send({ message: "File deleted" });
  } catch (error) {
    console.error(error);
    return await reply.code(500).send({ message: "Failed to delete file" });
  }
}

export async function createThesis(
  req: FastifyRequest<{
    Body: CreateThesisInput;
  }>,
  reply: FastifyReply
) {
  const {
    title,
    year,
    keywords,
    abstract,
    fileUrl,
    author_name,
    author_registration,
    advisor_id,
  } = req.body;

  const keywordsArray = keywords.map((keyword) => keyword);

  const yearValidationError = year && validateYear(year);
  if (yearValidationError) {
    return reply.code(400).send({
      message: yearValidationError,
    });
  }

  const author = await prisma.author.findUnique({
    where: {
      registration: author_registration,
    },
  });

  if (author) {
    return await reply.code(400).send({
      message: "Author already exists, update the thesis instead",
    });
  }

  const thesis = await prisma.thesis.create({
    data: {
      title,
      year,
      abstract,
      fileUrl,
      keywords: keywordsArray,
      author: {
        create: {
          name: author_name,
          registration: author_registration,
          advisor: {
            connect: {
              id: advisor_id,
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
  const {
    title,
    year,
    keywords,
    abstract,
    fileUrl,
    author_name,
    author_registration,
    advisor_id,
  } = req.body;

  try {
    const thesis = await prisma.thesis.findUnique({
      where: { id },
    });

    if (!thesis) {
      return reply.code(404).send({ message: "Thesis not found" });
    }

    const yearValidationError = year && validateYear(year);
    if (yearValidationError) {
      return reply.code(400).send({
        message: yearValidationError,
      });
    }

    const updatedThesis = await prisma.thesis.update({
      where: { id },
      data: {
        title,
        year,
        fileUrl,
        abstract,
        keywords: keywords ? { set: keywords } : undefined,
        author: {
          update: {
            registration: author_registration,
            name: author_name,
            advisor: advisor_id ? { connect: { id: advisor_id } } : undefined,
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

    return await reply.code(200).send(thesis);
  } catch (error) {
    console.error(error);
    if ((error as { code: string }).code === "P2025") {
      return await reply.code(404).send({ message: "Thesis not found" });
    }
    return await reply.code(500).send({ message: "Failed to delete thesis" });
  }
}

export async function getThesis(
  req: FastifyRequest<{
    Querystring: GetThesisQuery;
  }>,
  reply: FastifyReply
) {
  const skip = Number(req.query.skip) || 0;
  const take = Number(req.query.take) || 20;
  const search = req.query.search || "";
  const orderBy = req.query.orderBy || "year";
  const sort = (req.query.sort || "desc") as "asc" | "desc";

  const yearSearch = isYear(search);

  const searchConditions: ThesisFilters = {
    OR: [
      {
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        keywords: {
          has: search,
        },
      },
      ...(yearSearch
        ? [
            {
              year: yearSearch,
            },
          ]
        : []),
      { author: { name: { contains: search, mode: "insensitive" } } },
      {
        author: {
          advisor: { name: { contains: search, mode: "insensitive" } },
        },
      },
    ],
  };

  const [thesis, total] = await prisma.$transaction([
    prisma.thesis.findMany({
      where: searchConditions,
      take,
      skip,
      select: {
        id: true,
        title: true,
        year: true,
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
      orderBy:
        orderBy === "author"
          ? { author: { name: sort } }
          : orderBy === "advisor"
          ? {
              author: { advisor: { name: sort } },
            }
          : { [orderBy]: sort },
    }),
    prisma.thesis.count({
      where: searchConditions,
    }),
  ]);

  const totalPages = take ? Math.ceil(total / take) : 1;

  return (await reply.code(200).send({
    thesis,
    total,
    totalPages,
  })) as GetThesisResponse;
}

export async function getThesisById(
  req: FastifyRequest<{
    Params: ThesisParams;
  }>,
  reply: FastifyReply
) {
  const { id } = req.params;

  const thesis = await prisma.thesis.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      year: true,
      fileUrl: true,
      keywords: true,
      abstract: true,
      author: {
        select: {
          name: true,
          registration: true,
          advisor: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  return await reply.code(200).send(thesis);
}

export async function getTopKeywords(req: FastifyRequest, reply: FastifyReply) {
  const theses = await prisma.thesis.findMany({
    select: {
      keywords: true,
    },
  });

  const keywordCount: Record<string, number> = {};

  theses.forEach((thesis: { keywords: string[] }) => {
    thesis.keywords.forEach((keyword: string) => {
      const normalizedKeyword = keyword.toLowerCase();
      if (keywordCount[normalizedKeyword]) {
        keywordCount[normalizedKeyword] += 1;
      } else {
        keywordCount[normalizedKeyword] = 1;
      }
    });
  });

  const sortedKeywords = Object.entries(keywordCount)
    .map(([keyword, count]) => ({ keyword, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return await reply.code(200).send(sortedKeywords);
}

export async function getAllKeywords(req: FastifyRequest, reply: FastifyReply) {
  const theses = await prisma.thesis.findMany({
    select: {
      keywords: true,
    },
  });

  const keywordCount: Record<string, number> = {};

  theses.forEach((thesis: { keywords: string[] }) => {
    thesis.keywords.forEach((keyword: string) => {
      const normalizedKeyword = keyword.toLowerCase();
      if (keywordCount[normalizedKeyword]) {
        keywordCount[normalizedKeyword] += 1;
      } else {
        keywordCount[normalizedKeyword] = 1;
      }
    });
  });

  const sortedKeywords = Object.entries(keywordCount)
    .map(([keyword, count]) => ({ keyword, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 100);

  return await reply.code(200).send(sortedKeywords);
}

export async function getThesisByYear(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const thesisByYear = await prisma.thesis.groupBy({
    by: ["year"],
    _count: {
      id: true,
    },
    orderBy: {
      year: "asc",
    },
  });

  return await reply.code(200).send(
    thesisByYear.map(
      (item: {
        year: number;
        _count: {
          id: number;
        };
      }) => ({
        year: item.year,
        thesis: item._count.id,
      })
    )
  );
}
