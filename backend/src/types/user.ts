import { Prisma } from "@prisma/client";

export type ILoggedUserMiddleware = Prisma.UserGetPayload<{
  include: {
    activeMatch: true;
    purchase: true;
  };
}> & { dateOfBirth: string };
