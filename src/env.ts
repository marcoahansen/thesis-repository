import { z } from "zod";

const envSchema = z.object({
  CLOUDFLARE_SECRET_KEY: z.string(),
  CLOUDFLARE_ACCESS_KEY: z.string(),
  CLOUDFLARE_ENDPOINT: z.string().url(),
  BUCKET_NAME: z.string(),
  PORT: z.coerce.number().default(3333),
  HOST: z.string().default("0.0.0.0"),
  CORS_DEV: z.string().default("http://localhost:5173"),
  CORS_BUILD: z.string().default("http://localhost:4173"),
  CORS_DOCKER: z.string().default("http://localhost"),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string(),
  FCOOKIE_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);
