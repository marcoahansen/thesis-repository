import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import {
  createThesisResponseSchema,
  createThesisSchema,
  updateThesisSchema,
  thesisParams,
} from "./thesis.schema";
import {
  createThesis,
  deleteThesis,
  getThesis,
  updateThesis,
  getUploadUrl,
  getThesisById,
  getTopKeywords,
  getThesisByYear,
  getAllKeywords,
} from "./thesis.controller";

export async function thesisRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/register",
    {
      preHandler: [app.authenticate],
      schema: {
        body: createThesisSchema,
        response: {
          201: createThesisResponseSchema,
        },
      },
    },
    createThesis
  );

  app.withTypeProvider<ZodTypeProvider>().put(
    "/:id/update",
    {
      preHandler: [app.authenticate],
      schema: {
        body: updateThesisSchema,
        response: {
          201: createThesisResponseSchema,
        },
      },
    },
    updateThesis
  );

  app.withTypeProvider<ZodTypeProvider>().delete(
    "/:id/delete",
    {
      preHandler: [app.authenticate],
      schema: {
        params: thesisParams,
      },
    },
    deleteThesis
  );
  app.withTypeProvider<ZodTypeProvider>().post(
    "/upload",
    {
      preHandler: [app.authenticate],
    },
    getUploadUrl
  );

  app.withTypeProvider<ZodTypeProvider>().get("/", getThesis);
  app.withTypeProvider<ZodTypeProvider>().get("/:id", getThesisById);
  app.withTypeProvider<ZodTypeProvider>().get("/keywords", getTopKeywords);
  app.withTypeProvider<ZodTypeProvider>().get("/all-keywords", getAllKeywords);
  app.withTypeProvider<ZodTypeProvider>().get("/year", getThesisByYear);
}
