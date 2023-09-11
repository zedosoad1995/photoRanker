import { IVoteRes } from "@/Types/vote";
import api from "./index";

export const vote = async (matchId: string, winnerPictureId?: string): Promise<IVoteRes> => {
  return api.post("/votes", { matchId, winnerPictureId });
};
