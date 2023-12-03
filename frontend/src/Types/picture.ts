import { IAgeGroup } from "@shared/types/picture";
import { Countries, Ethnicities, Genders } from "@shared/types/user";

export interface IUpdatedPic {
  id: string;
  url: string;
  numVotes: number;
  maxFreeVotes: number;
  isActive: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPictureWithPercentile {
  id: string;
  url: string;
  percentile: number | null;
  numVotes: number;
  numPaidVotes: number;
  cannotSeeAllVotes: boolean;
  isActive: boolean;
  ageGroupPercentile?: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IPictureVotingStats {
  id: string;
  voter_name: string;
  voter_gender: Genders | null;
  voter_country: Countries | null;
  voter_ethnicity: Ethnicities | null;
  voter_age: number;
  is_winner: boolean;
  winner: string | null;
  loser: string | null;
  createdAt: Date;
}

export interface IGetPictureVotingStats {
  stats: IPictureVotingStats[];
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
