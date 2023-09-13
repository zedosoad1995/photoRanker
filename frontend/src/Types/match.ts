export interface IMatch {
  id: string;
  pictures: {
    id: string;
    url: string;
  }[];
  winProbability: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMatchRes {
  match: IMatch;
}
