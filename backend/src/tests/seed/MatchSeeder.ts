import { MatchModel } from "@/models/match";
import { Prisma } from "@prisma/client";
import _ from "underscore";

type SeedInputOne = Partial<Prisma.MatchCreateInput>;

interface SeedInputMany {
  data?: Partial<Prisma.MatchCreateInput> | Partial<Prisma.MatchCreateInput>[];
  numRepeat?: number;
}

export const MatchSeeder = {
  async seedOne(data: SeedInputOne = {}) {
    await this.deleteAll();
    return this.createOne(data);
  },

  async seedMany(
    { data = {}, numRepeat = 1 }: SeedInputMany = { data: {}, numRepeat: 1 }
  ) {
    await this.deleteAll();
    return this.createMany({ data, numRepeat });
  },

  async createOne(data: SeedInputOne = {}) {
    return MatchModel.create({ data });
  },

  async createMany(
    { data = {}, numRepeat = 1 }: SeedInputMany = { data: {}, numRepeat: 1 }
  ) {
    if (Array.isArray(data)) {
      return Promise.all(
        data.map((row) =>
          MatchModel.create({
            data: row,
          })
        )
      );
    }

    return Promise.all(
      _.times(numRepeat, () =>
        MatchModel.create({
          data,
        })
      )
    );
  },

  async deleteAll() {
    await MatchModel.deleteMany();
  },
};
