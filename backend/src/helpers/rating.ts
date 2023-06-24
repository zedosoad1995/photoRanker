import { ELO_UPDATE_FACTOR, SENSITIVITY } from "@/constants/rating";

export const calculateNewRating = (
  isWin: boolean,
  playerRating: number,
  opponentRating: number
) => {
  const outcome = Number(isWin);

  const expectedOutcome =
    1 / (1 + Math.pow(10, (opponentRating - playerRating) / SENSITIVITY));

  const newRating =
    playerRating + ELO_UPDATE_FACTOR * (outcome - expectedOutcome);

  return newRating;
};
