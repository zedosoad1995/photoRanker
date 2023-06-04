import { NextFunction, Request, Response } from "express";
import prisma from "@/helpers/prismaClient";

export const getMany = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();

  res.status(200).json({ users });
};

export const createOne = async (req: Request, res: Response) => {
  const user = await prisma.user.create({
    data: req.body,
  });

  res.status(201).json({ user });
};
