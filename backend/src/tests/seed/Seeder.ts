import { Prisma } from "@prisma/client";
import { UserSeeder } from "./UserSeeder";

export const Seeder = (name: Prisma.ModelName) => {
  if (name === "User") {
    return new UserSeeder();
  }
};
