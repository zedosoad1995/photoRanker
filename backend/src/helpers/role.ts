import { UserRole } from "@prisma/client";

export const isRegular = (role: string) => {
  return role === UserRole.REGULAR;
};

export const isAdmin = (role: string) => {
  return role === UserRole.ADMIN;
};
