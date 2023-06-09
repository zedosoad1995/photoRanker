import _prisma from "@/helpers/prismaClient";
import _ from "underscore";

export const prisma = _prisma.$extends({
  model: {
    $allModels: {
      exclude<Model, Key extends keyof Model>(
        doc: Model,
        keys: Key[]
      ): Omit<Model, Key> {
        for (const key of keys) {
          delete doc[key];
        }
        return doc;
      },
      excludeFromArray<Model, Key extends keyof Model>(
        docs: Model[],
        keys: Key[]
      ): Omit<Model, Key>[] {
        // @ts-ignore
        return docs.map((doc) => _.omit(doc, keys));
      },
    },
  },
});
