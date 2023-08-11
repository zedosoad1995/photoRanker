import { IReportRes } from "@/Types/report";
import api from "./index";

export const createReport = async (pictureId: string): Promise<IReportRes> => {
  return api.post("/reports", { pictureId });
};
