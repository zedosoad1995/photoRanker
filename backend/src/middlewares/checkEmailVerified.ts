import { ForbiddenError } from "@/errors/ForbiddenError";
import { Request, Response, NextFunction } from "express";

export const checkEmailVerified = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.loggedUser?.isEmailVerified) {
    throw new ForbiddenError("User has not yet verified its email");
  }

  next();
};
