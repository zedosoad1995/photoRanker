import { ForbiddenError } from "@/errors/ForbiddenError";
import { Request, Response, NextFunction } from "express";

export const checkBanned = async (req: Request, res: Response, next: NextFunction) => {
  if (req.loggedUser?.isBanned) {
    throw new ForbiddenError("Banned users cannot access this resource");
  }

  next();
};
