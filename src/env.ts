import { z } from "zod";

const envSchema = z.object({
  CLOUDFLARE_SECRET_KEY: z.string(),
  CLOUDFLARE_ACCESS_KEY: z.string(),
  CLOUDFLARE_ENDPOINT: z.string().url(),
  BUCKET_NAME: z.string(),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string(),
  FCOOKIE_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);
