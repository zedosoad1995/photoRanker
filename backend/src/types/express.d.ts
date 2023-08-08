import { Prisma, User } from "@prisma/client";
import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      loggedUser?: Prisma.UserGetPayload<{include: {
        activeMatch: true
      }}>;
    }
  }
}
