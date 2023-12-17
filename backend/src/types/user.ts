import { Gender, Prisma } from "@prisma/client";

export type ILoggedUserMiddleware = Prisma.UserGetPayload<{
  include: {
    activeMatch: true;
    purchase: true;
  };
}>;

export type ILoggedUser = ILoggedUserMiddleware & { dateOfBirth: string; gender: Gender };
