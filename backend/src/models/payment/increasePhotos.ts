import { NotFoundError } from "@/errors/NotFoundError";
import { prisma } from "../";
import { MAX_PAID_PHOTOS } from "@shared/constants/purchase";

export const increasePhotos = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      numLimitPhotos: MAX_PAID_PHOTOS,
      purchase: {
        upsert: {
          create: {
            hasIncreasedPhotoLimit: true,
          },
          update: {
            hasIncreasedPhotoLimit: true,
          },
        },
      },
    },
  });
};
