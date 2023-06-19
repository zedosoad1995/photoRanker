import { ELO_INIT } from "@/constants/picture";
import { BadRequestError } from "@/errors/BadRequestError";
import { ForbiddenError } from "@/errors/ForbiddenError";
import { isRegular } from "@/helpers/role";
import { PictureModel } from "@/models/picture";
import { User } from "@prisma/client";
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

export const deleteOne = async (req: Request, res: Response) => {
  const pictureId = req.params.pictureId;
  const loggedUser = req.loggedUser as User;

  const existingPicture = await PictureModel.findUnique({
    where: {
      id: pictureId,
    },
  });

  if (!existingPicture) {
    throw new BadRequestError("Picture does not exist");
  }

  if (isRegular(loggedUser.role) && existingPicture.userId !== loggedUser.id) {
    throw new ForbiddenError("User cannot delete this picture");
  }

  await PictureModel.delete({
    where: {
      id: pictureId,
    },
  });

  res.sendStatus(204);
};
