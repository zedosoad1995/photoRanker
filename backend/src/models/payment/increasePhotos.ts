import { NotFoundError } from "@/errors/NotFoundError";
import { prisma } from "../";

const MAX_NUM_PHOTOS = 100;

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
      numLimitPhotos: MAX_NUM_PHOTOS,
    },
  });
};
