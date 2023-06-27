import { VoteModel } from "@/models/vote";
import { Prisma } from "@prisma/client";
import _ from "underscore";

type SeedInputOne = Prisma.VoteUncheckedCreateInput;

interface SeedInputMany {
  data: Prisma.VoteUncheckedCreateInput | Prisma.VoteUncheckedCreateInput[];
  numRepeat?: number;
}

export const VoteSeeder = {
  async seedOne(data: SeedInputOne) {
    await this.deleteAll();
    return this.createOne(data);
  },

  async seedMany({ data, numRepeat = 1 }: SeedInputMany) {
    await this.deleteAll();
    return this.createMany({ data, numRepeat });
  },

  async createOne(data: SeedInputOne) {
    return VoteModel.create({ data });
  },

  async createMany({ data, numRepeat = 1 }: SeedInputMany) {
    if (Array.isArray(data)) {
      return Promise.all(
        data.map((row) =>
          VoteModel.create({
            data: row,
          })
        )
      );
    }

    return Promise.all(
      _.times(numRepeat, () =>
        VoteModel.create({
          data,
        })
      )
    );
  },

  async deleteAll() {
    await VoteModel.deleteMany();
  },
};
