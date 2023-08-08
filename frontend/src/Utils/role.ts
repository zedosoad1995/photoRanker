import { ROLE } from "@shared/constants/user";

export const isRegular = (role: string) => {
  return role === ROLE.REGULAR;
};

export const isAdmin = (role: string) => {
  return role === ROLE.ADMIN;
};
