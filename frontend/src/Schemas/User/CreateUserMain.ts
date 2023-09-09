import { z } from "zod";

export const CreateUserMainSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(50),
    email: z.string().email("Invalid email format"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(30, "Password can be at most 30 characters long"),
  })
  .strict();

export type ICreateUserMain = z.infer<typeof CreateUserMainSchema>;
