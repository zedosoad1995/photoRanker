import { Request, Response, NextFunction } from "express";
import { CustomError } from "@/errors/CustomError";
import multer from "multer";
import { PICTURE } from "@/constants/messages";
import axios from "axios";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send(err.serializeErrors());
  }

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).send({
        message: PICTURE.INVALID_FORM_KEY,
      });
    } else if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).send({
        message: PICTURE.FILE_TOO_LARGE,
      });
    }
  }

  if (axios.isAxiosError(err)) {
    console.error(err.status, err.code, err.cause, err.message, err.response?.data);
  } else {
    console.error(err);
  }

  return res.status(400).send({
    message: "Something went wrong",
  });
};
