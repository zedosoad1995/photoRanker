import { comparePasswords } from "@/helpers/password";
import { UserModel } from "@/models/user";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { UnauthorizedError } from "@/errors/UnauthorizedError";
import { OAuth2Client } from "google-auth-library";

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
    throw new UnauthorizedError("Google access token is undefined");
  }

  const { email, sub: googleId } = await oAuth2Client.getTokenInfo(tokens.access_token);

  const user = await UserModel.findFirst({
    where: {
      email,
      googleId,
    },
  });

  if (!user) {
    throw new UnauthorizedError("User does not exist. Invalid email or googleId");
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
