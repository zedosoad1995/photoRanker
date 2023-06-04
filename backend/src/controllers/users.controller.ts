import { Request, Response } from "express";
import { hashPassowrd } from "@/helpers/password";
import { UserModel } from "@/models/user";
import _ from "underscore";
import { ConflictError } from "@/errors/ConflictError";
import { NotFoundError } from "@/errors/NotFoundError";

export const getMany = async (req: Request, res: Response) => {
  const users = await UserModel.findMany();
  const usersNoPassword = UserModel.excludeFromArray(users, ["password"]);

  res.status(200).json({ users: usersNoPassword });
};

export const getOne = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  const user = await UserModel.findUnique({ where: { id: userId } });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const userNoPassword = UserModel.exclude(user, ["password"]);

  res.status(200).json({ user: userNoPassword });
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

  const userNoPassword = UserModel.exclude(user, ["password"]);

  res.status(201).json({ user: userNoPassword });
};

export const updateOne = async (req: Request, res: Response) => {
  const body = { ...req.body };
  const userId = req.params.userId;

  const user = await UserModel.findUnique({ where: { id: userId } });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  if (body.password) {
    body.password = await hashPassowrd(body.password);
  }

  const updatedUser = await UserModel.update({
    data: body,
    where: {
      id: userId,
    },
  });

  const userNoPassword = UserModel.exclude(updatedUser, ["password"]);

  res.status(200).json({ user: userNoPassword });
};
