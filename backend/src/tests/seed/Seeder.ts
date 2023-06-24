import { Prisma } from "@prisma/client";
import { UserSeeder } from "./UserSeeder";
import { PictureSeeder } from "./PictureSeeder";
import { MatchSeeder } from "./MatchSeeder";

export const Seeder = (
  name: Prisma.ModelName
): UserSeeder | PictureSeeder | MatchSeeder | undefined => {
  if (name === "User") {
    return new UserSeeder();
  } else if (name === "Picture") {
    return new PictureSeeder();
  } else if (name === "Match") {
    return new MatchSeeder();
  }
};
