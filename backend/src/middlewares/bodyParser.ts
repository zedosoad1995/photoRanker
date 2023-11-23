import { json, raw } from "body-parser";
import { Request, Response } from "express";

const rawBodyBuffer = (req: Request, res: Response, buf: Buffer, encoding: string) => {
  if (req.originalUrl.includes("stripe-webhook")) {
    req.rawBody = buf;
  }
};

export const jsonBodyParser = json({
  verify: rawBodyBuffer,
});
