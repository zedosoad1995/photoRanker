import { comparePasswords, hashPassword } from "@/helpers/password";
import { UserModel } from "@/models/user";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { UnauthorizedError } from "@/errors/UnauthorizedError";
import { OAuth2Client } from "google-auth-library";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { AUTH } from "@/constants/messages";
import { FACEBOOK_CALLBACK_URI } from "@/constants/uri";
import { BadRequestError } from "@/errors/BadRequestError";
import { getEmailHtml, sendEmail } from "@/helpers/mail";
import { getDateInXHours } from "@/helpers/date";
import {
  INVALID_CREDENTIALS,
  INVALID_LOGIN_METHOD_EMAIL,
  INVALID_LOGIN_METHOD_FACEBOOK,
  INVALID_LOGIN_METHOD_GOOGLE,
  NON_EXISTENT_EMAIL,
} from "@shared/constants/errorCodes";
import { ForbiddenError } from "@/errors/ForbiddenError";
import { cookieOptions } from "@/constants/cookies";
const { NO_ACCESS_TOKEN, UNVERIFIED_EMAIL } = AUTH.GOOGLE;
const { NO_ACCESS_TOKEN: NO_ACCESS_TOKEN_FACEBOOK } = AUTH.FACEBOOK;

export const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await UserModel.findUnique({ where: { email } });
  if (!user || !user.password) {
    throw new UnauthorizedError("Invalid credentials", INVALID_CREDENTIALS);
  }

  const isPasswordMatch = await comparePasswords(password, user.password);
  if (!isPasswordMatch) {
    throw new UnauthorizedError("Invalid credentials", INVALID_CREDENTIALS);
  }

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

  res.status(200).json({ user: userNoPassword });
};

export const signOut = (req: Request, res: Response) => {
  res.clearCookie("session", cookieOptions);

  res.status(204).send();
};

const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "postmessage"
);

export const signInGoogle = async (req: Request, res: Response) => {
  const { tokens } = await oAuth2Client.getToken(req.body.code);

  if (!tokens.access_token) {
    throw new UnauthorizedError(NO_ACCESS_TOKEN);
  }

  const {
    data: { email, sub: googleId, email_verified, name },
  } = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: {
      Authorization: `Bearer ${tokens.access_token}`,
    },
  });

  if (!email_verified) {
    throw new UnauthorizedError(UNVERIFIED_EMAIL);
  }

  const user = await UserModel.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    const newUser = await UserModel.create({
      data: {
        email,
        name,
        isProfileCompleted: false,
        isEmailVerified: true,
        googleId,
      },
    });

    const userJwt = jwt.sign(
      {
        email: newUser.email,
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

    const userNoPassword = UserModel.exclude(newUser, ["password", "googleId", "facebookId"]);

    return res.status(201).json({ user: userNoPassword });
  }

  if (user.googleId === null) {
    if (user.password !== null) {
      throw new UnauthorizedError(
        "You registered using your email directly. Please log in with that method",
        INVALID_LOGIN_METHOD_EMAIL
      );
    } else if (user.facebookId !== null) {
      throw new UnauthorizedError(
        "You registered using facebook. Please log in with that method",
        INVALID_LOGIN_METHOD_FACEBOOK
      );
    }
  }

  if (user.googleId !== googleId) {
    throw new UnauthorizedError();
  }

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

  res.status(200).json({ user: userNoPassword });
};

export const signInFacebook = async (req: Request, res: Response) => {
  const { code } = req.body;

  const response = await axios.get("https://graph.facebook.com/v4.0/oauth/access_token", {
    params: {
      client_id: process.env.FACEBOOK_CLIENT_ID,
      client_secret: process.env.FACEBOOK_CLIENT_SECRET,
      redirect_uri: FACEBOOK_CALLBACK_URI,
      code,
    },
  });

  if (!response.data?.access_token) {
    throw new UnauthorizedError(NO_ACCESS_TOKEN_FACEBOOK);
  }

  const {
    data: { id, email, name },
  } = await axios.get("https://graph.facebook.com/me", {
    params: {
      fields: ["id", "email", "name"].join(","),
      access_token: response.data.access_token,
    },
  });

  const user = await UserModel.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    const newUser = await UserModel.create({
      data: {
        email,
        name,
        isProfileCompleted: false,
        isEmailVerified: true,
        facebookId: id,
      },
    });

    const userJwt = jwt.sign(
      {
        email: newUser.email,
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

    const userNoPassword = UserModel.exclude(newUser, ["password", "googleId", "facebookId"]);

    return res.status(201).json({ user: userNoPassword });
  }

  if (user.facebookId === null) {
    if (user.password !== null) {
      throw new UnauthorizedError(
        "You registered using your email directly. Please log in with that method",
        INVALID_LOGIN_METHOD_EMAIL
      );
    } else if (user.googleId !== null) {
      throw new UnauthorizedError(
        "You registered using google. Please log in with that method",
        INVALID_LOGIN_METHOD_GOOGLE
      );
    }
  }

  if (user.facebookId !== id) {
    throw new UnauthorizedError();
  }

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

  res.status(200).send({ user: userNoPassword });
};

export const verifyEmail = async (req: Request, res: Response) => {
  const verificationToken = req.params.token;

  const user = await UserModel.findFirst({
    where: {
      verificationToken,
    },
  });

  if (!user || !user.verificationTokenExpiration) {
    throw new BadRequestError("Invalid token");
  }

  if (user.isEmailVerified) {
    throw new BadRequestError("Email has already been verified");
  }

  if (new Date() > user.verificationTokenExpiration) {
    throw new BadRequestError("Token has expired");
  }

  const updatedUser = await UserModel.update({
    data: {
      isEmailVerified: true,
      verificationToken: null,
      verificationTokenExpiration: null,
    },
    where: {
      id: user.id,
    },
  });

  const userJwt = jwt.sign(
    {
      email: updatedUser.email,
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

  return res.status(204).send();
};

export const resendEmail = async (req: Request, res: Response) => {
  const loggedUser = req.loggedUser!;

  if (loggedUser.isEmailVerified) {
    throw new BadRequestError("Email has already been verified");
  }

  const verificationToken = uuidv4();
  const expiration = getDateInXHours(Number(process.env.VERIFICATION_TOKEN_EXPIRATION_HOURS));

  await UserModel.update({
    data: {
      verificationToken,
      verificationTokenExpiration: expiration,
    },
    where: {
      id: loggedUser.id,
    },
  });

  const html = await getEmailHtml("src/views/emailVerification.ejs", {
    user: {
      name: loggedUser.name,
    },
    verificationUrl: `${process.env.FRONTEND_URL}/checking-validation/${verificationToken}`,
  });

  sendEmail({
    from: process.env.SENDER_EMAIL,
    to: loggedUser.email,
    subject: "Email Verification",
    html,
  });

  return res.status(204).send();
};

export const forgotPassword = async (req: Request, res: Response) => {
  const email = req.body.email as string;

  const user = await UserModel.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new BadRequestError("Email does not exist", NON_EXISTENT_EMAIL);
  }

  // Is using Google or Facebook authentication
  if (!user.password) {
    throw new ForbiddenError("This account does not need a password reset");
  }

  const token = uuidv4();
  const expiration = getDateInXHours(Number(process.env.VERIFICATION_TOKEN_EXPIRATION_HOURS));

  await UserModel.update({
    data: {
      resetPasswordToken: token,
      resetPasswordExpiration: expiration,
    },
    where: {
      id: user.id,
    },
  });

  const html = await getEmailHtml("src/views/resetPassword.ejs", {
    user: {
      name: user.name,
    },
    verificationUrl: `${process.env.FRONTEND_URL}/reset-password/${token}`,
  });

  sendEmail({
    from: process.env.SENDER_EMAIL,
    to: user.email,
    subject: "Reset Password",
    html,
  });

  return res.status(204).send();
};

export const resetPassword = async (req: Request, res: Response) => {
  const token = req.params.token;
  const password = req.body.password as string;

  const user = await UserModel.findFirst({
    where: {
      resetPasswordToken: token,
    },
  });

  if (!user || !user.resetPasswordExpiration) {
    throw new BadRequestError("Invalid Token");
  }

  // Is using Google or Facebook authentication
  if (!user.password) {
    throw new ForbiddenError("This account does not need a password reset");
  }

  if (new Date() > user.resetPasswordExpiration) {
    throw new BadRequestError("Token has expired");
  }

  const newHashedPassword = await hashPassword(password);

  await UserModel.update({
    data: {
      password: newHashedPassword,
      resetPasswordToken: null,
      resetPasswordExpiration: null,
    },
    where: {
      id: user.id,
    },
  });

  return res.status(204).send();
};
