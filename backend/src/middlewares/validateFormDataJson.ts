import { ValidationError } from "@/errors/ValidationError";
import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

export const validateFormDataJson =
  (schema: AnyZodObject, key: string) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(JSON.parse(req.body[key]));
      req.body = { ...req.body, ...JSON.parse(req.body[key]) };
      return next();
    } catch (error) {
      if (!(error instanceof ZodError)) {
        throw error;
      }

      throw new ValidationError(error);
    }
  };
