import { z } from "zod";

const createAdvisorSchema = z.object({
  name: z.string(),
  registration: z.string(),
  email: z.string(),
});

export type CreateAdvisorInput = z.infer<typeof createAdvisorSchema>;

const updateAdvisorSchema = z.object({
  name: z.string().optional(),
  registration: z.string().optional(),
  email: z.string().optional(),
});

export type UpdateAdvisorInput = z.infer<typeof updateAdvisorSchema>;

const advisorParams = z.object({
  id: z.string(),
});

export type AdvisorParams = z.infer<typeof advisorParams>;

const createAdvisorResponseSchema = z.object({
  id: z.string(),
});

const getAdvisorQuerySchema = z.object({
  take: z.number().optional(),
  skip: z.number().optional(),
  search: z.string().optional(),
  orderBy: z.string().optional(),
  sort: z.string().optional(),
});

export type GetAdvisorQuery = z.infer<typeof getAdvisorQuerySchema>;

const getAdvisorResponseSchema = z.object({
  advisors: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      registration: z.string(),
      email: z.string(),
    })
  ),
  total: z.number(),
  totalPages: z.number(),
});

export type GetAdvisorResponse = z.infer<typeof getAdvisorResponseSchema>;

export type AdvisorsFilters = {
  OR: Array<{
    name?: {
      contains: string;
      mode: "insensitive";
    };
    registration?: {
      contains: string;
      mode: "insensitive";
    };
    email?: {
      contains: string;
      mode: "insensitive";
    };
  }>;
};

export {
  createAdvisorSchema,
  createAdvisorResponseSchema,
  getAdvisorQuerySchema,
  getAdvisorResponseSchema,
  updateAdvisorSchema,
};
