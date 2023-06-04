import { NextFunction, Request, Response } from "express";
import prisma from "@/helpers/prismaClient";

export const getMany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const users = await prisma.user.findMany();

  res.status(200).json({ users });
};
