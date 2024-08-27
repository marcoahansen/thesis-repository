import { z } from 'zod'

const createThesisSchema = z.object({
  title: z.string(),
  year: z.number(),
  keywords: z.array(z.string()),
  filePath: z.string(),
  author_name: z.string(),
  advisor_name: z.string(),
})

export type CreateThesisInput = z.infer<typeof createThesisSchema>

const createThesisResponseSchema = z.object({
  id: z.string(),
})

export { createThesisResponseSchema, createThesisSchema }
