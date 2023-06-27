import { PictureModel } from "@/models/picture";
import { Prisma } from "@prisma/client";
import _ from "underscore";
import { randomizePicture } from "../helpers/picture";

interface SeedInput {
  data?:
    | Partial<Prisma.PictureCreateManyInput>
    | Partial<Prisma.PictureCreateManyInput>[];
  numRepeat?: number;
}

export const PictureSeeder = {
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
      const res = await PictureModel.createMany({
        data: data.map((row) => ({
          ...randomizePicture(),
          ...row,
        })),
      });

      return PictureModel.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: res.count,
      });
    }

    const res = await PictureModel.createMany({
      data: _.times(numRepeat, () => ({
        ...randomizePicture(),
        ...data,
      })),
    });

    return PictureModel.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: res.count,
    });
  },

  async deleteAll() {
    await PictureModel.deleteMany();
  },
};
