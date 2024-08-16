import _ from "underscore";
import { NotFoundError } from "@/errors/NotFoundError";
import { prisma } from "@/models";
import { User } from "@prisma/client";
import { getAgeGroupQuery } from "../helpers/user";
import { COUNTRIES_BY_CONTINENT } from "@shared/constants/user";
import { StorageInteractor } from "@/types/repositories/storageInteractor";

const getInnerPicturesQuery = (picUser: User) => {
  const whereQuery = [
    `usr."isBanned" IS FALSE`,
    `usr.gender = '${picUser.gender}'`,
    `pic."numVotes" > 0`,
    `pic."isGlobal" IS TRUE`,
  ];
  const whereStr = whereQuery.join(" AND ");

  const [ageGroupQuery, ageGroup] = getAgeGroupQuery(
    picUser.dateOfBirth as string,
    `usr."dateOfBirth"`,
  );

  const selectsQuery = [
    `pic.id`,
    `100 * PERCENT_RANK() OVER (ORDER BY pic.rating) AS "percentileGeneral"`,
    `100 * PERCENT_RANK() OVER (
        PARTITION BY CASE WHEN ${ageGroupQuery} THEN 1 ELSE 0 END
        ORDER BY pic.rating
        ) AS "percentileByAgeGroup"`,
    `100 * PERCENT_RANK() OVER (
        PARTITION BY CASE WHEN ethnicity = '${picUser.ethnicity}' THEN 1 ELSE 0 END
        ORDER BY pic.rating
        ) AS "percentileByEthnicity"`,
  ];

  const continentCountry = Object.entries(COUNTRIES_BY_CONTINENT).find(([_, countries]) =>
    (countries as string[]).includes(picUser.countryOfOrigin as string),
  );
  if (continentCountry) {
    const [_, countries] = continentCountry;

    selectsQuery.push(`100 * PERCENT_RANK() OVER (
        PARTITION BY CASE WHEN "countryOfOrigin" IN ('${countries.join("', '")}') THEN 1 ELSE 0 END
        ORDER BY pic.rating
        ) AS "percentileByContinent"`);
  }

  const selectStr = selectsQuery.join(", ");

  return {
    query: `
    SELECT ${selectStr} 
    FROM "Picture" AS pic
    INNER JOIN "User" AS usr
        ON pic."userId" = usr.id
    WHERE ${whereStr}
    `,
    ageGroup,
    continent: continentCountry?.[0],
  };
};

// TODO: Do not forget paid votes
export const getPictureStats = async (
  pictureId: string,
  loggedUser: User,
  storageInteractor: StorageInteractor,
) => {
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

  if (!picture.isGlobal) {
    // TODO...
    const url = storageInteractor.getImageUrl(picture.filepath);
    return _.pick(picture, ["id", "numVotes", "isActive"]);
  }

  const whereQuery = [`pic.id = '${pictureId}'`];
  const whereStr = whereQuery.join(" AND ");

  const { query: innerQuery, ageGroup, continent } = getInnerPicturesQuery(picture.user);

  const res: {
    id: string;
    percentileGeneral: number;
    percentileByAgeGroup: number;
    percentileByEthnicity: number;
    percentileByContinent?: number;
  }[] = await prisma.$queryRawUnsafe(`
    SELECT pic.*
    FROM (${innerQuery}) AS pic
    WHERE ${whereStr}`);

  const url = storageInteractor.getImageUrl(picture.filepath);

  return {
    ...res[0],
    ageGroup,
    continent,
    ethnicity: picture.user.ethnicity,
    url,
    ..._.pick(picture, ["numVotes", "isActive"]),
  };
};
