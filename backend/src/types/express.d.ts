import { User } from "@prisma/client";
import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      session?: any;
      loggedUser?: User;
    }
  }
}
