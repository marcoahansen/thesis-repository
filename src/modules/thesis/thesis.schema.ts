import { z } from "zod";

const createThesisSchema = z.object({
  title: z.string(),
  year: z.number(),
  keywords: z.array(z.string()),
  abstract: z.string(),
  fileUrl: z.string(),
  author_name: z.string(),
  author_registration: z.string(),
  advisor_name: z.string(),
  advisor_registration: z.string(),
});

export type CreateThesisInput = z.infer<typeof createThesisSchema>;

const updateThesisSchema = z.object({
  title: z.string().optional(),
  year: z.number().optional(),
  keywords: z.array(z.string()).optional(),
  abstract: z.string().optional(),
  fileUrl: z.string().optional(),
  author_name: z.string().optional(),
  author_registration: z.string().optional(),
  advisor_name: z.string().optional(),
  advisor_registration: z.string().optional(),
});
export type UpdateThesisInput = z.infer<typeof updateThesisSchema>;

const thesisParams = z.object({
  id: z.string(),
});

export type ThesisParams = z.infer<typeof thesisParams>;

const createThesisResponseSchema = z.object({
  id: z.string(),
});

const getThesisQuerySchema = z.object({
  keywords: z.string(),
});

export type GetThesisQuery = z.infer<typeof getThesisQuerySchema>;

const getThesisResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  year: z.number(),
  fileUrl: z.string(),
  keywords: z.array(z.string()),
});

export {
  createThesisResponseSchema,
  createThesisSchema,
  updateThesisSchema,
  getThesisQuerySchema,
  getThesisResponseSchema,
};
