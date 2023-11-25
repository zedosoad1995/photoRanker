import { IAgeGroup } from "@shared/types/picture";

export interface IPictureWithPercentile {
  id: string;
  url: string;
  percentile: number | null;
  numVotes: number;
  numPaidVotes: number;
  cannotSeeAllVotes: boolean;
  ageGroupPercentile?: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PictureRes {
  picture: IPictureWithPercentile;
}

export interface IGetManyPictures {
  pictures: IPictureWithPercentile[];
  nextCursor?: string;
  ageGroup: IAgeGroup;
}

export interface IUploadPermission {
  canUploadMore: boolean;
}
