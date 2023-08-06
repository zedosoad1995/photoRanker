import { ELO_UPDATE_FACTOR } from "@/constants/rating";
import { SENSITIVITY } from "@shared/constants/rating";

export const calculateNewRating = (
  isWin: boolean,
  playerRating: number,
  opponentRating: number
) => {
  const outcome = Number(isWin);

  const expectedOutcome = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / SENSITIVITY));

  const newRating = playerRating + ELO_UPDATE_FACTOR * (outcome - expectedOutcome);

  return newRating;
};

export const randomWeightedClosestElo = (elos: number[], target: number, param1: number = 1) => {
  const diffs = elos.map((num) => Math.abs(num - target));

  const weights = diffs.map((diff) => 1 / (param1 + diff));

  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const probabilities = weights.map((weight) => weight / totalWeight);

  const randomNum = Math.random();

  let cumulativeProbability = 0;
  for (let i = 0; i < elos.length; i++) {
    cumulativeProbability += probabilities[i];
    if (randomNum <= cumulativeProbability) {
      return i;
    }
  }

  return elos.length - 1;
};
