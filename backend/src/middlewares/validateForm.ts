import { ValidationError } from "@/errors/ValidationError";
import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

export const validateForm =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      return next();
    } catch (error) {
      if (!(error instanceof ZodError)) {
        throw error;
      }

      throw new ValidationError(error);
    }
  };
