export interface IMatch {
  id: string;
  pictures: {
    id: string;
    filepath: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IMatchRes {
  match: IMatch;
}
