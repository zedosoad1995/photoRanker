import { ForbiddenError } from "@/errors/ForbiddenError";
import { isRegular } from "@/helpers/role";
import { MatchModel } from "@/models/match";
import { ReportModel } from "@/models/report";
import { Request, Response } from "express";

export const createOne = async (req: Request, res: Response) => {
  const loggedUser = req.loggedUser!;
  const { pictureId } = req.body;

  if (isRegular(loggedUser.role)) {
    const activeMatch = await MatchModel.findFirst({
      where: {
        activeUserId: loggedUser.id,
        pictures: {
          some: {
            id: pictureId,
          },
        },
      },
    });

    if (!activeMatch) {
      throw new ForbiddenError("Picture is not in an active match");
    }
  }

  const createdReport = await ReportModel.create({
    data: {
      userReportingId: loggedUser.id,
      pictureId: pictureId,
    },
  });

  res.status(201).json({
    report: createdReport,
  });
};
