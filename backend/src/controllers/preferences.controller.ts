import { PreferenceModel } from "@/models/preference";
import { Request, Response } from "express";

export const getOne = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  const preference = await PreferenceModel.findUnique({
    where: {
      userId,
    },
  });

  res.status(200).send({ preference });
};

export const updateOne = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  const updatedPreference = await PreferenceModel.update({
    data: req.body,
    where: {
      userId,
    },
  });

  res.status(200).send({ preference: updatedPreference });
};
