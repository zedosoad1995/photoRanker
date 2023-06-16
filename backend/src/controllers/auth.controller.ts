import { BadRequestError } from "@/errors/BadRequestError";
import { comparePasswords } from "@/helpers/password";
import { UserModel } from "@/models/user";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

export const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await UserModel.findUnique({ where: { email } });
  if (!user) {
    throw new BadRequestError("Invalid credentials");
  }

  const isPasswordMatch = await comparePasswords(password, user.password);
  if (!isPasswordMatch) {
    throw new BadRequestError("Invalid credentials");
  }

  const userJwt = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_KEY!
  );

  req.session = {
    jwt: userJwt,
  };

  res.status(200).json({ user });
};
