import { ReportModel } from "@/models/report";
import { Prisma } from "@prisma/client";
import _ from "underscore";

type SeedInputOne = Prisma.ReportCreateInput;

interface SeedInputMany {
  data: Prisma.ReportCreateInput | Prisma.ReportCreateInput[];
  numRepeat?: number;
}

export const ReportSeeder = {
  async seedOne(data: SeedInputOne) {
    await this.deleteAll();
    return this.createOne(data);
  },

  async seedMany({ data, numRepeat = 1 }: SeedInputMany) {
    await this.deleteAll();
    return this.createMany({ data, numRepeat });
  },

  async createOne(data: SeedInputOne) {
    return ReportModel.create({ data });
  },

  async createMany({ data, numRepeat = 1 }: SeedInputMany) {
    if (Array.isArray(data)) {
      return Promise.all(
        data.map((row) =>
          ReportModel.create({
            data: row,
          })
        )
      );
    }

    return Promise.all(
      _.times(numRepeat, () =>
        ReportModel.create({
          data,
        })
      )
    );
  },

  async deleteAll() {
    await ReportModel.deleteMany();
  },
};
