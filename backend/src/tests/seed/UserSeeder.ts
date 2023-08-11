import { UserModel } from "@/models/user";
import { Prisma } from "@prisma/client";
import _ from "underscore";
import { randomizeUser } from "../helpers/user";

type SeedInputOne = Partial<Prisma.UserCreateInput>;

interface SeedInputMany {
  data?: Partial<Prisma.UserCreateInput> | Partial<Prisma.UserCreateInput>[];
  numRepeat?: number;
}

export const UserSeeder = {
  async seedOne(data: SeedInputOne = {}) {
    await this.deleteAll();
    return this.createOne(data);
  },

  async seedMany({ data = {}, numRepeat = 1 }: SeedInputMany = { data: {}, numRepeat: 1 }) {
    await this.deleteAll();
    return this.createMany({ data, numRepeat });
  },

  async createOne(data: SeedInputOne = {}) {
    return UserModel.create({
      data: {
        isEmailVerified: true,
        isProfileCompleted: true,
        ...randomizeUser(),
        ...data,
      },
    });
  },

  async createMany({ data = {}, numRepeat = 1 }: SeedInputMany = { data: {}, numRepeat: 1 }) {
    if (Array.isArray(data)) {
      return Promise.all(
        data.map((row) =>
          UserModel.create({
            data: {
              isEmailVerified: true,
              isProfileCompleted: true,
              ...randomizeUser(),
              ...row,
            },
          })
        )
      );
    }

    return Promise.all(
      _.times(numRepeat, () =>
        UserModel.create({
          data: {
            isEmailVerified: true,
            isProfileCompleted: true,
            ...randomizeUser(),
            ...data,
          },
        })
      )
    );
  },

  async deleteAll() {
    await UserModel.deleteMany();
  },
};
