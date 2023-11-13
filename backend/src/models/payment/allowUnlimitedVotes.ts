import { NotFoundError } from "@/errors/NotFoundError";
import { prisma } from "..";

export const allowUnlimitedVotes = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  prisma.$transaction([
    prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        purchase: {
          upsert: {
            create: {
              hasUnlimitedVotes: true,
            },
            update: {
              hasUnlimitedVotes: true,
            },
          },
        },
      },
    }),
    prisma.picture.updateMany({
      where: {
        id: userId,
      },
      data: {
        hasPurchasedUnlimitedVotes: true,
      },
    }),
  ]);
};
