import { Request, Response, NextFunction } from "express";
import { CustomError } from "@/errors/CustomError";
import multer from "multer";
import { IMAGE_SIZE_LIMIT, IMAGE_UPLOAD_KEY } from "@/constants/image";
import bytes from "bytes";

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

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).send({
        error: `Invalid form-data key. Picture must be sent using the key: "${IMAGE_UPLOAD_KEY}"`,
      });
    } else if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).send({
        error: `File size exceeds the limit (${bytes(IMAGE_SIZE_LIMIT)})`,
      });
    }
  }

  console.error(err);

  return res.status(400).send({
    message: "Something went wrong",
  });
};
