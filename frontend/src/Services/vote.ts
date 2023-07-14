import api from "./index";

export const vote = async (matchId: string, winnerPictureId: string) => {
  return api.post("/votes", { matchId, winnerPictureId });
};
