import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  createAdvisor,
  deleteAdvisor,
  updateAdvisor,
  getTopAdvisors,
  getAdvisors,
  getAdvisorsNames,
} from "./advisor.controller";

export async function advisorRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/register",
    {
      preHandler: [app.authenticate],
    },
    createAdvisor
  );
  app.withTypeProvider<ZodTypeProvider>().put(
    "/:id/update",
    {
      preHandler: [app.authenticate],
    },
    updateAdvisor
  );
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/:id/delete",
    {
      preHandler: [app.authenticate],
    },
    deleteAdvisor
  );
  app.withTypeProvider<ZodTypeProvider>().get("/top", getTopAdvisors);
  app.withTypeProvider<ZodTypeProvider>().get("/", getAdvisors);
  app.withTypeProvider<ZodTypeProvider>().get("/all", getAdvisorsNames);
}
