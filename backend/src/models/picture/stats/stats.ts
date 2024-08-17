import _ from "underscore";
import { NotFoundError } from "@/errors/NotFoundError";
import { prisma } from "@/models";
import { Picture, User } from "@prisma/client";
import { getAgeGroupQuery } from "../helpers/user";
import { COUNTRIES_BY_CONTINENT } from "@shared/constants/user";
import { StorageInteractor } from "@/types/repositories/storageInteractor";

const getInnerPicturesQuery = (picUser: User, pic: Picture) => {
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

  const ethnicity =
    picUser.role === "ADMIN" && pic.ethnicity !== null ? pic.ethnicity : picUser.ethnicity;
  const country =
    picUser.role === "ADMIN" && pic.countryOfOrigin !== null
      ? pic.countryOfOrigin
      : picUser.countryOfOrigin;

  const selectsQuery = [
    `pic.id`,
    `100 * PERCENT_RANK() OVER (ORDER BY pic.rating) AS "percentileGeneral"`,
    `100 * PERCENT_RANK() OVER (
        PARTITION BY CASE WHEN ${ageGroupQuery} THEN 1 ELSE 0 END
        ORDER BY pic.rating
        ) AS "percentileByAgeGroup"`,
    `100 * PERCENT_RANK() OVER (
        PARTITION BY CASE WHEN 
          CASE 
              WHEN usr.role = 'ADMIN' AND pic.ethnicity IS NOT NULL THEN pic.ethnicity
              ELSE usr.ethnicity
          END = '${ethnicity}' THEN 1 ELSE 0 END
        ORDER BY pic.rating
        ) AS "percentileByEthnicity"`,
  ];

  const continentCountry = Object.entries(COUNTRIES_BY_CONTINENT).find(([_, countries]) =>
    (countries as string[]).includes(country as string),
  );
  if (continentCountry) {
    const [_, countries] = continentCountry;

    selectsQuery.push(`100 * PERCENT_RANK() OVER (
        PARTITION BY CASE WHEN 
          CASE 
              WHEN usr.role = 'ADMIN' AND pic."countryOfOrigin" IS NOT NULL THEN pic."countryOfOrigin"
              ELSE usr."countryOfOrigin"
          END IN ('${countries.join("', '")}') THEN 1 ELSE 0 END
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
    ethnicity,
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
    const url = storageInteractor.getImageUrl(picture.filepath);
    return { ..._.pick(picture, ["id", "numVotes", "isActive", "isGlobal"]), url };
  }

  const whereQuery = [`pic.id = '${pictureId}'`];
  const whereStr = whereQuery.join(" AND ");

  const {
    query: innerQuery,
    ageGroup,
    continent,
    ethnicity,
  } = getInnerPicturesQuery(picture.user, picture);

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
    ethnicity,
    url,
    ..._.pick(picture, ["numVotes", "isActive", "isGlobal"]),
  };
};
