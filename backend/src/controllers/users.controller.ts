import { Request, Response } from "express";
import prisma from "@/helpers/prismaClient";
import { hashPassowrd } from "@/helpers/password";
import { UserModel } from "@/models/user";
import _ from "underscore";
import { ConflictError } from "@/errors/ConflictError";

export const getMany = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();

  res.status(200).json({ users });
};

export const createOne = async (req: Request, res: Response) => {
  const hashedPassword = await hashPassowrd(req.body.password);

  const userSameEmail = await UserModel.findUnique({
    where: {
      email: req.body.email,
    },
  });
  if (Boolean(userSameEmail)) {
    throw new ConflictError("Email already exists");
  }

  const user = await UserModel.create({
    data: { ...req.body, password: hashedPassword },
  });

  const userNoPassword = _.omit(user, "password");

  res.status(201).json({ user: userNoPassword });
};
