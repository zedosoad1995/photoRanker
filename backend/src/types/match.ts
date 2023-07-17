export interface IMatch {
  match: {
    id: string;
    pictures: {
      id: string;
      filepath: string;
    }[];
    createdAt: Date;
    updatedAt: Date;
  };
}
