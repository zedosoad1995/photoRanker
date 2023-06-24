import { Prisma } from "@prisma/client";
import { UserSeeder } from "./UserSeeder";
import { PictureSeeder } from "./PictureSeeder";
import { MatchSeeder } from "./MatchSeeder";
import { VoteSeeder } from "./VoteSeeder";

export const Seeder = (
  name: Prisma.ModelName
): UserSeeder | PictureSeeder | MatchSeeder | VoteSeeder | undefined => {
  if (name === "User") {
    return new UserSeeder();
  } else if (name === "Picture") {
    return new PictureSeeder();
  } else if (name === "Match") {
    return new MatchSeeder();
  } else if (name === "Vote") {
    return new VoteSeeder();
  }
};
