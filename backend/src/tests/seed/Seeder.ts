import { Prisma } from "@prisma/client";
import { UserSeeder } from "./UserSeeder";
import { PictureSeeder } from "./PictureSeeder";

export const Seeder = (name: Prisma.ModelName): UserSeeder | PictureSeeder | undefined => {
  if (name === "User") {
    return new UserSeeder();
  }else if (name === "Picture") {
    return new PictureSeeder();
  }
};
