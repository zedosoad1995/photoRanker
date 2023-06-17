import { ForbiddenError } from "@/errors/ForbiddenError";
import { UserRole } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

export const checkAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.loggedUser?.role !== UserRole.ADMIN) {
    throw new ForbiddenError();
  }

  next();
};
