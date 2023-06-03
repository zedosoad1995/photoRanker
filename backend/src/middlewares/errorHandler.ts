import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/CustomError";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({
      error: err.serializeErrors(),
    });
  }

  return res.status(400).send({
    message: "Something went wrong",
  });
};
