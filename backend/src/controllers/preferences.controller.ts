import { NotFoundError } from "@/errors/NotFoundError";
import { ValidationError } from "@/errors/ValidationError";
import { PreferenceModel } from "@/models/preference";
import { Request, Response } from "express";

export const getOne = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  const preference = await PreferenceModel.findUnique({
    where: {
      userId,
    },
  });

  if (!preference) {
    throw new NotFoundError("Preference not found");
  }

  res.status(200).send({ preference });
};

export const updateOne = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  const currPreference = await PreferenceModel.findFirst({
    where: {
      userId,
    },
  });

  if (!currPreference) {
    throw new NotFoundError("Preference not found");
  }

  PreferenceModel.checkMinMaxAges(
    "contentMaxAge",
    req.body.contentMaxAge,
    "contentMinAge",
    currPreference.contentMinAge
  );

  PreferenceModel.checkMinMaxAges(
    "contentMinAge",
    req.body.contentMinAge,
    "contentMaxAge",
    currPreference.contentMaxAge
  );

  PreferenceModel.checkMinMaxAges(
    "exposureMaxAge",
    req.body.exposureMaxAge,
    "exposureMinAge",
    currPreference.exposureMinAge
  );

  PreferenceModel.checkMinMaxAges(
    "exposureMinAge",
    req.body.exposureMinAge,
    "exposureMaxAge",
    currPreference.exposureMaxAge
  );

  const updatedPreference = await PreferenceModel.update({
    data: req.body,
    where: {
      userId,
    },
  });

  res.status(200).send({ preference: updatedPreference });
};
