import { UserRole } from "@prisma/client";
import { ILoginRes } from "./auth";

export interface ICreateRes {
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
}

export interface ICheckEmailRes {
  exists: boolean;
}

export type IGetMeRes = ILoginRes;
