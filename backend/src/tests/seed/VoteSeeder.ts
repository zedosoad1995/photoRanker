import { VoteModel } from "@/models/vote";
import { Prisma } from "@prisma/client";
import _ from "underscore";
import { randomizeVote } from "../helpers/vote";

interface SeedInput {
  data: Prisma.VoteCreateManyInput | Prisma.VoteCreateManyInput[];
  numRepeat?: number;
}

export class VoteSeeder {
  async seed({ data, numRepeat = 1 }: SeedInput) {
    await this.deleteAll();
    return this.createMany({ data, numRepeat });
  }

  async createMany({ data, numRepeat = 1 }: SeedInput) {
    if (Array.isArray(data)) {
      return Promise.all(
        data.map((row) =>
          VoteModel.create({
            data: {
              ...randomizeVote(row),
              ...row,
            },
          })
        )
      );
    }

    return Promise.all(
      _.times(numRepeat, () =>
        VoteModel.create({
          data: {
            ...randomizeVote(data),
            ...data,
          },
        })
      )
    );
  }

  async deleteAll() {
    await VoteModel.deleteMany();
  }
}
