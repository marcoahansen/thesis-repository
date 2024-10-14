import { z } from "zod";

export const createUserSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email(),
  password: z.string().min(6),
  registration: z.string(),
  name: z.string(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  registration: z.string().optional(),
  name: z.string().optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const createUserResponseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
});

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email(),
  password: z.string().min(6),
});
export type LoginUserInput = z.infer<typeof loginSchema>;
export const loginResponseSchema = z.object({
  accessToken: z.string(),
});

const getUsersQuerySchema = z.object({
  take: z.number().optional(),
  skip: z.number().optional(),
  search: z.string().optional(),
  orderBy: z.string().optional(),
  sort: z.string().optional(),
});

export type GetUsersQuery = z.infer<typeof getUsersQuerySchema>;

const getUsersResponseSchema = z.object({
  users: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      registration: z.string(),
    })
  ),
  total: z.number(),
  totalPages: z.number(),
});

export type UsersFilters = {
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

export type GetUsersResponse = z.infer<typeof getUsersResponseSchema>;
