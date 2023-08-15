export interface RatingRepo<T> {
  calculateNewRating: (p1: T, p2: T, isWin: boolean) => T;
  getWinProbability: (p1: T, p2: T) => number;
}
