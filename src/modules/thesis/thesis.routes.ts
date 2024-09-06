import { type FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import {
  createThesisResponseSchema,
  createThesisSchema,
} from "./thesis.schema";
import {
  createThesis,
  deleteThesis,
  getThesis,
  getThesisByKeywords,
  getTopAdvisors,
  updateThesis,
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
  app.withTypeProvider<ZodTypeProvider>().put("/:id/update", updateThesis);
  app.withTypeProvider<ZodTypeProvider>().delete("/:id/delete", deleteThesis);
  app.withTypeProvider<ZodTypeProvider>().get("/", getThesis);
  app
    .withTypeProvider<ZodTypeProvider>()
    .get("/search/:keywords", getThesisByKeywords);
  app.withTypeProvider<ZodTypeProvider>().get("/advisors/top", getTopAdvisors);
}
