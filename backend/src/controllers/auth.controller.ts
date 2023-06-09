import { comparePasswords } from "@/helpers/password";
import { UserModel } from "@/models/user";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { UnauthorizedError } from "@/errors/UnauthorizedError";

export const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await UserModel.findUnique({ where: { email } });
  if (!user) {
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
