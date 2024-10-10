import { z } from "zod";

const createThesisSchema = z.object({
  title: z.string(),
  year: z.number(),
  keywords: z.array(z.string()),
  abstract: z.string(),
  fileUrl: z.string(),
  author_name: z.string(),
  author_registration: z.string(),
  advisor_id: z.string(),
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
  advisor_id: z.string().optional(),
});
export type UpdateThesisInput = z.infer<typeof updateThesisSchema>;

export const thesisParams = z.object({
  id: z.string().uuid(),
});

export type ThesisParams = z.infer<typeof thesisParams>;

const createThesisResponseSchema = z.object({
  id: z.string(),
});

const getThesisQuerySchema = z.object({
  take: z.number().optional(),
  skip: z.number().optional(),
});

export type GetThesisQuery = z.infer<typeof getThesisQuerySchema>;

const getThesisResponseSchema = z.object({
  thesis: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      year: z.number(),
      fileUrl: z.string(),
      keywords: z.array(z.string()),
      author: z.object({
        name: z.string(),
        advisor: z.object({
          name: z.string(),
        }),
      }),
    })
  ),
  total: z.number(),
  totalPages: z.number(),
});

export type GetThesisResponse = z.infer<typeof getThesisResponseSchema>;

export {
  createThesisResponseSchema,
  createThesisSchema,
  updateThesisSchema,
  getThesisQuerySchema,
  getThesisResponseSchema,
};
