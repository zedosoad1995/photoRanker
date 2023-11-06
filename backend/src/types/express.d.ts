import { Prisma, User } from "@prisma/client";
import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      rawBody?: Buffer;
      loggedUser?: Prisma.UserGetPayload<{
        include: {
          activeMatch: true;
        };
      }>;
    }
  }
}
