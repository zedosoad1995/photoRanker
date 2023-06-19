import { ELO_INIT } from "@/constants/picture";
import { BadRequestError } from "@/errors/BadRequestError";
import { PictureModel } from "@/models/picture";
import { Request, Response } from "express";

export const upload = async (req: Request, res: Response) => {
  if (!req.file) {
    throw new BadRequestError("No file uploaded");
  }

  await PictureModel.create({
    data: {
      filepath: req.file.filename,
      elo: ELO_INIT,
      user: {
        connect: {
          id: req.loggedUser?.id,
        },
      },
    },
  });

  res.status(200).json({
    message: "Image successfully uploaded",
  });
};
