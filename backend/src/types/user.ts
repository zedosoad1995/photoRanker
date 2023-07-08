import { UserRole } from "@prisma/client";

export interface IUserNoPassword {
  user: {
    id: string;
    name: string;
    email: string;
    ethnicity: string;
    countryOfOrigin: string;
    dateOfBirth: string;
    role: UserRole;
    activeMatchId: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
}

export type ICreateRes = IUserNoPassword;

export interface ICheckEmailRes {
  exists: boolean;
}

export type IGetMeRes = IUserNoPassword;
