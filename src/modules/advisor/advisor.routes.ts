import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  createAdvisor,
  deleteAdvisor,
  updateAdvisor,
  getTopAdvisors,
  getAdvisors,
} from "./advisor.controller";

export async function advisorRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/",
    {
      preHandler: [app.authenticate],
    },
    createAdvisor
  );
  app.withTypeProvider<ZodTypeProvider>().put(
    "/:id",
    {
      preHandler: [app.authenticate],
    },
    updateAdvisor
  );
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/:id",
    {
      preHandler: [app.authenticate],
    },
    deleteAdvisor
  );
  app.withTypeProvider<ZodTypeProvider>().get("/top", getTopAdvisors);
  app.withTypeProvider<ZodTypeProvider>().get("/", getAdvisors);
}
