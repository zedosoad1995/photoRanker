import { ForbiddenError } from "@/errors/ForbiddenError";
import { Request, Response, NextFunction } from "express";

export const checkProfileCompleted = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.loggedUser?.isProfileCompleted) {
    throw new ForbiddenError("Profile is not completed");
  }

  next();
};
