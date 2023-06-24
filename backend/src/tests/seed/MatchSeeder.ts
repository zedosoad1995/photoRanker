import { MatchModel } from "@/models/match";
import { Prisma } from "@prisma/client";
import _ from "underscore";
import { randomizeMatch } from "../helpers/match";

interface SeedInput {
  data?: Partial<Prisma.MatchCreateInput> | Partial<Prisma.MatchCreateInput>[];
  numRepeat?: number;
}

export class MatchSeeder {
  async seed(
    { data = {}, numRepeat = 1 }: SeedInput = { data: {}, numRepeat: 1 }
  ) {
    await this.deleteAll();
    return this.createMany({ data, numRepeat });
  }

  async createMany(
    { data = {}, numRepeat = 1 }: SeedInput = { data: {}, numRepeat: 1 }
  ) {
    if (Array.isArray(data)) {
      return Promise.all(
        data.map((row) =>
          MatchModel.create({
            data: {
              ...randomizeMatch(),
              ...row,
            },
          })
        )
      );
    }

    return Promise.all(
      _.times(numRepeat, () =>
        MatchModel.create({
          data: {
            ...randomizeMatch(),
            ...data,
          },
        })
      )
    );
  }

  async deleteAll() {
    await MatchModel.deleteMany();
  }
}
