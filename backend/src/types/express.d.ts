import { Prisma, User } from "@prisma/client";
import * as express from "express";
import { ILoggedUserMiddleware } from "./user";

declare global {
  namespace Express {
    interface Request {
      rawBody?: Buffer;
      loggedUser?: ILoggedUserMiddleware;
    }
  }
}
