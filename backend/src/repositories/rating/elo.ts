import { ELO_UPDATE_FACTOR, SENSITIVITY } from "@/constants/rating";
import { RatingRepo } from "@/types/repositories/ratingRepo";

interface IPlayer {
  rating: number;
}

export class Elo implements RatingRepo {
  public calculateNewRating({ rating: p1 }: IPlayer, { rating: p2 }: IPlayer, isWin: boolean) {
    const outcome = Number(isWin);

    const expectedOutcome = this.getWinProbability(p1, p2);

    const newRating = p1 + ELO_UPDATE_FACTOR * (outcome - expectedOutcome);

    return { rating: newRating };
  }

  public getWinProbability(p1: number, p2: number) {
    return 1 / (1 + Math.pow(10, (p2 - p1) / SENSITIVITY));
  }
}
