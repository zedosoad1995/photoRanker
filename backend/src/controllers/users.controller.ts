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
import { getEmailHtml } from "@/helpers/mail";
import { getDateInXHours } from "@/helpers/date";
import jwt from "jsonwebtoken";
import { cookieOptions } from "@/constants/cookies";
import { prisma } from "@/models";
import { BannedUserModel } from "@/models/bannerUser";
import { BANNED_ACCOUNT } from "@shared/constants/errorCodes";
import { StorageInteractor } from "@/types/repositories/storageInteractor";
import { PictureModel } from "@/models/picture";
import { SENDGRID_EMAIL_NAME } from "@/constants/email";
import { MailRepo } from "@/types/repositories/mailRepo";
import { MAX_FREE_PHOTOS } from "@shared/constants/purchase";

export const getMany = async (req: Request, res: Response) => {
  const users = await UserModel.findMany();

  res.status(200).json({ users: UserModel.dumpMany(users) });
};

export const getOne = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const loggedUser = req.loggedUser!;

  if ((!isAdmin(loggedUser.role) || loggedUser.isBanned) && userId !== loggedUser.id) {
    throw new ForbiddenError();
  }

  const user = await UserModel.findUnique({ where: { id: userId } });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  res.status(200).json({ user: UserModel.dump(user) });
};

export const getMe = async (req: Request, res: Response) => {
  const loggedUser = req.loggedUser!;

  res.status(200).json({ user: UserModel.dump(loggedUser) });
};

export const createOne = (mailingService: MailRepo) => async (req: Request, res: Response) => {
  const hashedPassword = await hashPassword(req.body.password);

  const bannedUser = await BannedUserModel.findUnique({
    where: {
      email: req.body.email,
    },
  });
  if (bannedUser) {
    throw new ForbiddenError(
      "This email has been banned. You cannot create another account",
      BANNED_ACCOUNT,
    );
  }

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
      preference: {
        create: {},
      },
      password: hashedPassword,
      isProfileCompleted: true,
      verificationTokenExpiration: expires,
      verificationToken,
      numLimitPhotos: MAX_FREE_PHOTOS,
      canBypassPreferences: Math.random() < 0.3,
    },
  });

  const html = await getEmailHtml("emailVerification.ejs", {
    user: {
      name: req.body.name,
    },
    verificationUrl: `${process.env.FRONTEND_URL}/checking-validation/${verificationToken}`,
  });

  mailingService.sendEmail({
    from: { email: process.env.SENDGRID_EMAIL!, name: SENDGRID_EMAIL_NAME },
    to: req.body.email,
    subject: "Email Verification",
    html,
    text: "Photo Scorer",
  });

  const userJwt = jwt.sign(
    {
      email: user.email,
    },
    process.env.JWT_KEY!,
  );

  res.cookie(
    "session",
    {
      jwt: userJwt,
    },
    cookieOptions,
  );

  res.status(201).json({ user: UserModel.dump(user) });
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
    data: {
      ...body,
      preference: {
        create: {},
      },
      isProfileCompleted: true,
      numLimitPhotos: MAX_FREE_PHOTOS,
    },
    where: {
      id: userId,
    },
  });

  res.status(200).json({ user: UserModel.dump(updatedUser) });
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

  res.status(200).json({ user: UserModel.dump(updatedUser) });
};

export const checkEmailExists = async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await UserModel.findUnique({ where: { email } });

  const emailExists = Boolean(user);

  res.status(200).send({
    exists: emailExists,
  });
};

export const deleteMe =
  (storageInteractor: StorageInteractor) => async (req: Request, res: Response) => {
    const loggedUser = req.loggedUser!;

    const pictures = await PictureModel.findMany({
      where: {
        userId: loggedUser.id,
      },
    });

    await UserModel.delete({
      where: { id: loggedUser.id },
    });

    res.clearCookie("session");

    for (const picture of pictures) {
      await storageInteractor.deleteImage(picture.filepath);
    }

    res.status(204).send();
  };

export const deleteOne =
  (storageInteractor: StorageInteractor) => async (req: Request, res: Response) => {
    const loggedUser = req.loggedUser!;
    const userId = req.params.userId;

    if (userId === loggedUser.id && isAdmin(loggedUser.role)) {
      throw new ForbiddenError("Admin user cannot delete itseld");
    }

    const pictures = await PictureModel.findMany({
      where: {
        userId: userId,
      },
    });

    await UserModel.delete({
      where: { id: userId },
    });

    for (const picture of pictures) {
      await storageInteractor.deleteImage(picture.filepath);
    }

    res.status(204).send();
  };

export const ban = async (req: Request, res: Response) => {
  const loggedUser = req.loggedUser!;
  const userId = req.params.userId;

  if (userId === loggedUser.id) {
    throw new ForbiddenError("You cannot ban yourself");
  }

  const user = await UserModel.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new NotFoundError("User does not exist");
  }

  const [bannedUser, _] = await prisma.$transaction([
    UserModel.update({
      data: { isBanned: true },
      where: { id: userId },
    }),
    BannedUserModel.create({
      data: { email: user.email },
    }),
  ]);

  res.status(200).send({ user: bannedUser });
};

export const unban = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  const user = await UserModel.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new NotFoundError("User does not exist");
  }

  const [unbannedUser, _] = await prisma.$transaction([
    UserModel.update({
      data: { isBanned: false },
      where: { id: userId },
    }),
    BannedUserModel.delete({
      where: { email: user.email },
    }),
  ]);

  res.status(200).send({ user: unbannedUser });
};
