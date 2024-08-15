import { NotFoundError } from "@/errors/NotFoundError";
import { prisma } from "@/models";
import { User } from "@prisma/client";
import { getAgeGroupQuery } from "../helpers/user";
import { COUNTRIES_BY_CONTINENT } from "@shared/constants/user";

const getInnerPicturesQuery = (picUser: User) => {
  const whereQuery = [
    `usr."isBanned" IS FALSE`,
    `usr.gender = '${picUser.gender}'`,
    `pic."numVotes" > 0`,
    `pic."isGlobal" IS TRUE`,
  ];
  const whereStr = whereQuery.join(" AND ");

  const [ageGroupQuery] = getAgeGroupQuery(picUser.dateOfBirth as string, `usr."dateOfBirth"`);

  const selectsQuery = [
    `pic.id`,
    `PERCENT_RANK() OVER (ORDER BY pic.rating) AS "percentileGeneral"`,
    `PERCENT_RANK() OVER (
        PARTITION BY CASE WHEN ${ageGroupQuery} THEN 1 ELSE 0 END
        ORDER BY pic.rating
        ) AS "percentileByAgeGroup"`,
    `PERCENT_RANK() OVER (
        PARTITION BY CASE WHEN ethnicity = '${picUser.ethnicity}' THEN 1 ELSE 0 END
        ORDER BY pic.rating
        ) AS "percentileByEthnicity"`,
  ];

  const continentCountry = Object.entries(COUNTRIES_BY_CONTINENT).find(([_, countries]) =>
    (countries as string[]).includes(picUser.countryOfOrigin as string),
  );
  if (continentCountry) {
    const [continent, countries] = continentCountry;

    selectsQuery.push(`PERCENT_RANK() OVER (
        PARTITION BY CASE WHEN "countryOfOrigin" IN ('${countries.join("', '")}') THEN 1 ELSE 0 END
        ORDER BY pic.rating
        ) AS "percentileByEthnicity"`);
    selectsQuery.push(`'${continent}' AS continent`);
  }

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
      user: true,
    },
  });

  if (!picture || (loggedUser.role === "REGULAR" && picture.userId !== loggedUser.id)) {
    throw new NotFoundError("Picture does not exist");
  }

  const whereQuery = [`pic.id = '${pictureId}'`];
  const whereStr = whereQuery.join(" AND ");

  const innerQuery = getInnerPicturesQuery(picture.user);

  return prisma.$queryRawUnsafe(`
    SELECT pic.*
    FROM (${innerQuery}) AS pic
    WHERE ${whereStr}`);
};
