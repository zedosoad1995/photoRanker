import { UserModel } from "@/models/user";
import { Prisma } from "@prisma/client";
import _ from "underscore";
import { randomizeUser } from "../helpers/user";

interface SeedInput {
  data?: Partial<Prisma.UserCreateInput> | Partial<Prisma.UserCreateInput>[];
  numRepeat?: number;
}

export const UserSeeder = {
  async seed(
    { data = {}, numRepeat = 1 }: SeedInput = { data: {}, numRepeat: 1 }
  ) {
    await this.deleteAll();
    return this.createMany({ data, numRepeat });
  },

  async createMany(
    { data = {}, numRepeat = 1 }: SeedInput = { data: {}, numRepeat: 1 }
  ) {
    if (Array.isArray(data)) {
      const res = await UserModel.createMany({
        data: data.map((row) => ({
          ...randomizeUser(),
          ...row,
        })),
      });

      return UserModel.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: res.count,
      });
    }

    const res = await UserModel.createMany({
      data: _.times(numRepeat, () => ({
        ...randomizeUser(),
        ...data,
      })),
    });

    return UserModel.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: res.count,
    });
  },

  async deleteAll() {
    await UserModel.deleteMany();
  },
};
