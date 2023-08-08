import api from "./index";
import { IMatchRes } from "@/Types/match";

export const getNewMatch = async (): Promise<IMatchRes> => {
  return api.post("/matches");
};
