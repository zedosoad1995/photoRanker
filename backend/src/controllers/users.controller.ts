import { Request, Response } from "express";
import { hashPassword } from "@/helpers/password";
import { UserModel } from "@/models/user";
import _ from "underscore";
import { ConflictError } from "@/errors/ConflictError";
import { NotFoundError } from "@/errors/NotFoundError";
import { isAdmin } from "@/helpers/role";
import { ForbiddenError } from "@/errors/ForbiddenError";
import { BadRequestError } from "@/errors/BadRequestError";
import { v4 as uuidv4 } from "uuid";
import { getEmailHtml, sendEmail } from "@/helpers/mail";
import { getDateInXHours } from "@/helpers/date";
import jwt from "jsonwebtoken";
import { cookieOptions } from "@/constants/cookies";

export const getMany = async (req: Request, res: Response) => {
  const users = await UserModel.findMany();
  const usersNoPassword = UserModel.excludeFromArray(users, ["password"]);

  res.status(200).json({ users: usersNoPassword });
};

export const getOne = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const loggedUser = req.loggedUser!;

  if (!isAdmin(loggedUser.role) && userId !== loggedUser.id) {
    throw new ForbiddenError();
  }

  const user = await UserModel.findUnique({ where: { id: userId } });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const userNoPassword = UserModel.exclude(user, ["password", "googleId", "facebookId"]);

  res.status(200).json({ user: userNoPassword });
};

export const getMe = async (req: Request, res: Response) => {
  const loggedUser = req.loggedUser!;

  const userNoPassword = UserModel.exclude(loggedUser, ["password", "googleId", "facebookId"]);

  res.status(200).json({ user: userNoPassword });
};

export const createOne = async (req: Request, res: Response) => {
  const hashedPassword = await hashPassword(req.body.password);

  const userSameEmail = await UserModel.findUnique({
    where: {
      email: req.body.email,
    },
  });
  if (Boolean(userSameEmail)) {
    throw new ConflictError("Email already exists");
  }

  const verificationToken = uuidv4();
  const expires = getDateInXHours(Number(process.env.VERIFICATION_TOKEN_EXPIRATION_HOURS));

  const user = await UserModel.create({
    data: {
      ...req.body,
      password: hashedPassword,
      isProfileCompleted: true,
      verificationTokenExpiration: expires,
      verificationToken,
    },
  });

  const html = await getEmailHtml("src/views/emailVerification.ejs", {
    user: {
      name: req.body.name,
    },
    verificationUrl: `${process.env.FRONTEND_URL}/checking-validation/${verificationToken}`,
  });

  sendEmail({
    from: process.env.SENDER_EMAIL,
    to: req.body.email,
    subject: "Email Verification",
    html,
  });

  const userJwt = jwt.sign(
    {
      email: user.email,
    },
    process.env.JWT_KEY!
  );

  res.cookie(
    "session",
    {
      jwt: userJwt,
    },
    cookieOptions
  );

  const userNoPassword = UserModel.exclude(user, ["password", "googleId", "facebookId"]);

  res.status(201).json({ user: userNoPassword });
};

export const createProfile = async (req: Request, res: Response) => {
  const body = { ...req.body };
  const userId = req.params.userId;

  const user = await UserModel.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new NotFoundError("User does not exist");
  }

  if (user.isProfileCompleted) {
    throw new BadRequestError("User profile has already been created");
  }

  const updatedUser = await UserModel.update({
    data: { ...body, isProfileCompleted: true },
    where: {
      id: userId,
    },
  });

  const userNoPassword = UserModel.exclude(updatedUser, ["password", "googleId", "facebookId"]);

  res.status(200).json({ user: userNoPassword });
};

export const updateOne = async (req: Request, res: Response) => {
  const body = { ...req.body };
  const userId = req.params.userId;

  const user = await UserModel.findUnique({ where: { id: userId } });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  if (body.password) {
    body.password = await hashPassword(body.password);
  }

  const updatedUser = await UserModel.update({
    data: body,
    where: {
      id: userId,
    },
  });

  const userNoPassword = UserModel.exclude(updatedUser, ["password", "googleId", "facebookId"]);

  res.status(200).json({ user: userNoPassword });
};

export const checkEmailExists = async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await UserModel.findUnique({ where: { email } });

  const emailExists = Boolean(user);

  res.status(200).send({
    exists: emailExists,
  });
};

export const deleteMe = async (req: Request, res: Response) => {
  const loggedUser = req.loggedUser!;

  await UserModel.delete({
    where: { id: loggedUser.id },
  });

  res.clearCookie("session");

  res.status(204).send();
};

export const deleteOne = async (req: Request, res: Response) => {
  const loggedUser = req.loggedUser!;
  const userId = req.params.userId;

  if (userId === loggedUser.id && isAdmin(loggedUser.role)) {
    throw new ForbiddenError("Admin user cannot delete itseld");
  }

  await UserModel.delete({
    where: { id: userId },
  });

  res.status(204).send();
};
