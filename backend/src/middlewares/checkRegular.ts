import { ForbiddenError } from "@/errors/ForbiddenError";
import { UserRole } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

export const checkRegular = async (req: Request, res: Response, next: NextFunction) => {
  if (req.loggedUser?.role !== UserRole.REGULAR) {
    throw new ForbiddenError();
  }

  next();
};
