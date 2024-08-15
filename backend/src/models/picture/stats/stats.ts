import { NotFoundError } from "@/errors/NotFoundError";
import { prisma } from "@/models";
import { Gender, User } from "@prisma/client";

const getInnerPicturesQuery = (picGender: Gender | null) => {
  const whereQuery = [
    `usr."isBanned" IS FALSE`,
    `usr.gender = '${picGender}'`,
    `pic."numVotes" > 0`,
    `pic."isGlobal" IS TRUE`,
  ];
  const whereStr = whereQuery.join(" AND ");

  const selectsQuery = [`pic.id`, `PERCENT_RANK() OVER (ORDER BY pic.rating) AS percentile`];
  const selectStr = selectsQuery.join(", ");

  return `
    SELECT ${selectStr} 
    FROM "Picture" AS pic
    INNER JOIN "User" AS usr
        ON pic."userId" = usr.id
    WHERE ${whereStr}
    `;
};

export const getPictureStats = async (pictureId: string, loggedUser: User) => {
  const picture = await prisma.picture.findUnique({
    where: {
      id: pictureId,
    },
    include: {
      user: {
        select: {
          gender: true,
        },
      },
    },
  });

  if (!picture || (loggedUser.role === "REGULAR" && picture.userId !== loggedUser.id)) {
    throw new NotFoundError("Picture does not exist");
  }

  const whereQuery = [`pic.id = '${pictureId}'`];
  const whereStr = whereQuery.join(" AND ");

  const innerQuery = getInnerPicturesQuery(picture.user.gender);

  return prisma.$queryRawUnsafe(`
    SELECT pic.*
    FROM (${innerQuery}) AS pic
    WHERE ${whereStr}`);
};
