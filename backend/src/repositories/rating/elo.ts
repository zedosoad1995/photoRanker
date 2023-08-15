import { ELO_UPDATE_FACTOR } from "@/constants/rating";
import { RatingRepo } from "@/types/ratingRepo";
import { SENSITIVITY } from "@shared/constants/rating";

export class Elo implements RatingRepo<number> {
  public calculateNewRating(p1: number, p2: number, isWin: boolean) {
    const outcome = Number(isWin);

    const expectedOutcome = this.getWinProbability(p1, p2);

    const newRating = p1 + ELO_UPDATE_FACTOR * (outcome - expectedOutcome);

    return newRating;
  }

  public getWinProbability(p1: number, p2: number) {
    return 1 / (1 + Math.pow(10, (p2 - p1) / SENSITIVITY));
  }
}
