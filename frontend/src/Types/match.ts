export interface IMatch {
  id: string;
  pictures: {
    id: string;
    filepath: string;
  }[];
  winProbability: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMatchRes {
  match: IMatch;
}
