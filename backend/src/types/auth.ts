import { UserRole } from "@prisma/client";

export interface ILoginRes {
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
