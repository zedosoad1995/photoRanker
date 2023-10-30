import { PictureModel } from "@/models/picture";
import { Prisma } from "@prisma/client";
import _ from "underscore";
import { randomizePicture } from "../helpers/picture";

type SeedInputOne = Partial<Prisma.PictureUncheckedCreateInput>;

interface SeedInputMany {
  data?:
    | Partial<Prisma.PictureUncheckedCreateInput>
    | Partial<Prisma.PictureUncheckedCreateInput>[];
  numRepeat?: number;
}

export const PictureSeeder = {
  async seedOne(data: SeedInputOne = {}) {
    await this.deleteAll();
    return this.createOne(data);
  },

  async seedMany({ data = {}, numRepeat = 1 }: SeedInputMany = { data: {}, numRepeat: 1 }) {
    await this.deleteAll();
    return this.createMany({ data, numRepeat });
  },

  async createOne(data: SeedInputOne = {}) {
    return PictureModel.create({
      data: {
        ...randomizePicture(),
        ...data,
      },
    });
  },

  async createMany({ data = {}, numRepeat = 1 }: SeedInputMany = { data: {}, numRepeat: 1 }) {
    if (Array.isArray(data)) {
      return Promise.all(
        data.map((row) =>
          PictureModel.create({
            data: {
              ...randomizePicture(),
              ...row,
            },
          })
        )
      );
    }

    return Promise.all(
      _.times(numRepeat, () =>
        PictureModel.create({
          data: {
            ...randomizePicture(),
            ...data,
          },
        })
      )
    );
  },

  async deleteAll() {
    await PictureModel.deleteMany();
  },
};
