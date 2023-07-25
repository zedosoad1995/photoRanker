import { User } from "@prisma/client";

export interface IUserNoPassword {
  user: Omit<User, "password">;
}

export type ICreateRes = IUserNoPassword;

export interface ICheckEmailRes {
  exists: boolean;
}

export type IGetMeRes = IUserNoPassword;
