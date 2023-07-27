import { comparePasswords } from "@/helpers/password";
import { UserModel } from "@/models/user";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { UnauthorizedError } from "@/errors/UnauthorizedError";
import { OAuth2Client } from "google-auth-library";
import { AUTH } from "@/constants/messages";
const { NO_ACCESS_TOKEN, UNVERIFIED_EMAIL, NON_EXISTING_USER } = AUTH.GOOGLE;

export const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await UserModel.findUnique({ where: { email } });
  if (!user || !user.password) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const isPasswordMatch = await comparePasswords(password, user.password);
  if (!isPasswordMatch) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const userJwt = jwt.sign(
    {
      email: user.email,
    },
    process.env.JWT_KEY!
  );

  res.cookie("session", {
    jwt: userJwt,
  });

  const userNoPassword = UserModel.exclude(user, ["password"]);

  res.status(200).json({ user: userNoPassword });
};

export const signOut = (req: Request, res: Response) => {
  res.clearCookie("session");

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
    email,
    sub: googleId,
    email_verified,
  } = await oAuth2Client.getTokenInfo(tokens.access_token);

  if (!email_verified) {
    throw new UnauthorizedError(UNVERIFIED_EMAIL);
  }

  const user = await UserModel.findFirst({
    where: {
      email,
      googleId,
    },
  });

  if (!user) {
    throw new UnauthorizedError(NON_EXISTING_USER);
  }

  const userJwt = jwt.sign(
    {
      email: user.email,
    },
    process.env.JWT_KEY!
  );

  res.cookie("session", {
    jwt: userJwt,
  });

  const userNoPassword = UserModel.exclude(user, ["password"]);

  res.status(200).json({ user: userNoPassword });
};
