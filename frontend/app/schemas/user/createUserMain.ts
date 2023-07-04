import { z } from "zod";

export const createUserMainSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(50),
    email: z.string().email("Email is required"),
    password: z.string().min(6).max(30),
  })
  .strict();

export type ICreateUserMain = z.infer<typeof createUserMainSchema>;
