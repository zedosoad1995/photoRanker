import { UnauthorizedError } from "@/errors/UnauthorizedError";
import { UserModel } from "@/models/user";
import { JWTPayload } from "@/types/jwt";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  const jwtoken = req.cookies["session"]?.jwt;

  if (!jwtoken) {
    throw new UnauthorizedError();
  }

  try {
    const payload = jwt.verify(jwtoken, process.env.JWT_KEY!) as JWTPayload;

    const user = await UserModel.findUnique({
      where: {
        email: payload.email,
      },
    });
    if (!user) {
      throw new UnauthorizedError();
    }

    req.loggedUser = user;

    return next();
  } catch (err) {
    throw new UnauthorizedError();
  }
};
