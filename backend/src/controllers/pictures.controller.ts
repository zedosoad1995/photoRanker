import { BadRequestError } from "@/errors/BadRequestError";
import { Request, Response } from "express";

export const upload = async (req: Request, res: Response) => {
  if (!req.file) {
    throw new BadRequestError("No file uploaded");
  }

  res.status(200).json({
    message: "Image successfully uploaded",
  });
};
