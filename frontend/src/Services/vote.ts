import api from "./index";
import { IVote } from "../../../backend/src/types/vote";

export const vote = async (matchId: string, winnerPictureId: string): Promise<IVote> => {
  return api.post("/votes", { matchId, winnerPictureId });
};
