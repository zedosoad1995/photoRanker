import api from "./index";
import { IMatch } from "../../../backend/src/types/match";

export const getNewMatch = async (): Promise<IMatch> => {
  return api.post("/matches");
};
