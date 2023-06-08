import { UserModel } from "@/models/user";
import { Prisma } from "@prisma/client";
import _ from "underscore";
import { randomizeUser } from "../helpers/user";

interface SeedInput {
  data?: Partial<Prisma.UserCreateInput> | Partial<Prisma.UserCreateInput>[];
  numRepeat?: number;
}

export class UserSeeder {
  async seed(
    { data = {}, numRepeat = 1 }: SeedInput = { data: {}, numRepeat: 1 }
  ) {
    await UserModel.deleteMany();

    if (Array.isArray(data)) {
      await UserModel.createMany({
        data: data.map((row) => ({
          ...randomizeUser(),
          ...row,
        })),
      });

      return UserModel.findMany();
    }

    await UserModel.createMany({
      data: _.times(numRepeat, () => ({
        ...randomizeUser(),
        ...data,
      })),
    });

    return UserModel.findMany();
  }

  async deleteAll() {
    await UserModel.deleteMany();
  }
}
