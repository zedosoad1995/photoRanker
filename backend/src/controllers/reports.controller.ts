import { ORDER_BY_DIR_OPTIONS_TYPE } from "@/constants/query";
import { ForbiddenError } from "@/errors/ForbiddenError";
import { NotFoundError } from "@/errors/NotFoundError";
import { parseOrderBy } from "@/helpers/query";
import { isRegular } from "@/helpers/role";
import { MatchModel } from "@/models/match";
import { ReportModel } from "@/models/report";
import { Request, Response } from "express";

export const getMany = async (req: Request, res: Response) => {
  const { userId, pictureId, orderBy, orderByDir } = req.query;

  const orderByQuery = parseOrderBy({
    orderBy: orderBy as string | undefined,
    orderByDir: orderByDir as ORDER_BY_DIR_OPTIONS_TYPE | undefined,
  });

  const reports = await ReportModel.findMany({
    where: {
      userReportingId: userId as string | undefined,
      pictureId: pictureId as string | undefined,
    },
    orderBy: orderByQuery,
  });

  res.status(204).send({ reports });
};

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

export const deleteOne = async (req: Request, res: Response) => {
  const reportId = req.params.reportId;

  const report = await ReportModel.delete({
    where: {
      id: reportId,
    },
  });

  if (!report) {
    throw new NotFoundError("Report does not exist");
  }

  await ReportModel.delete({
    where: {
      id: reportId,
    },
  });

  res.status(204).send();
};
