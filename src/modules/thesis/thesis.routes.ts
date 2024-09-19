import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import {
  createThesisResponseSchema,
  createThesisSchema,
  updateThesisSchema,
} from "./thesis.schema";
import {
  createThesis,
  deleteThesis,
  getThesis,
  getThesisByKeywords,
  getTopAdvisors,
  updateThesis,
  getUploadUrl,
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
        params: {
          id: { type: "string" },
        },
      },
    },
    deleteThesis
  );
  app.withTypeProvider<ZodTypeProvider>().get(
    "/upload",
    {
      preHandler: [app.authenticate],
    },
    getUploadUrl
  );

  app.withTypeProvider<ZodTypeProvider>().get("/", getThesis);
  app
    .withTypeProvider<ZodTypeProvider>()
    .get("/search/:keywords", getThesisByKeywords);

  app.withTypeProvider<ZodTypeProvider>().get("/advisors/top", getTopAdvisors);
}
