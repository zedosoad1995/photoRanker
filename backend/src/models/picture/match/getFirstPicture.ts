import _ from "underscore";
import { Gender, Picture, Preference, User } from "@prisma/client";
import { isAdmin } from "@/helpers/role";
import { adjustDate, formatDate } from "@/helpers/date";
import { calculateAge } from "@shared/helpers/date";
import { prisma } from "@/models";

// Which demographic should the content (photos) being shown be (e.g only want to see females)
const getPhotoPreferencesQueries = (userPreferences: Preference | null) => {
  const whereArr = [];

  if (userPreferences) {
    // Gender preference
    if (userPreferences.contentGender) {
      whereArr.push(`usr.gender = '${userPreferences.contentGender}'`);
    }

    // Max age preference
    if (userPreferences.contentMaxAge) {
      whereArr.push(
        `usr."dateOfBirth" > '${formatDate(
          adjustDate(new Date(), { years: -userPreferences.contentMaxAge - 1 })
        )}'`
      );
    }

    // Min age preferences
    whereArr.push(
      `usr."dateOfBirth" < '${formatDate(
        adjustDate(new Date(), { years: -userPreferences.contentMinAge, days: 1 })
      )}'`
    );
  }

  return whereArr;
};

// Which demographic should the voter (logged user) be. Are you in the prefered demographics of the owner of the photo? If the owner of the photo only wants female voters, and you (the logged user) are a male, then the photo should not appear.
const getVoterPreferencesQueries = (loggedUser: User) => {
  const whereArr = [];

  // When 'canBypassPreferences' = true, then this will be ignored, and bypess it.
  if (!loggedUser.canBypassPreferences) {
    const query = [];

    // Allowed gender of logged user (voter)
    query.push(
      `(preference."exposureGender" = '${loggedUser.gender}' OR preference."exposureGender" IS NULL)`
    );

    if (loggedUser.dateOfBirth) {
      const loggedUserAge = calculateAge(loggedUser.dateOfBirth);

      // Max age of logged user (voter)
      query.push(
        `(preference."exposureMaxAge" >= ${loggedUserAge} OR preference."exposureMaxAge" IS NULL)`
      );

      // Min age of logged user (voter)
      query.push(`(preference."exposureMinAge" <= ${loggedUserAge})`);
    }

    // If the owner of the pic does not have a preference, then it will always be shown
    whereArr.push(`(${query.join(" AND ")} OR preference.id IS NULL)`);
  }

  return whereArr;
};

const photoCanOnlyBeVotedOnce = (loggedUser: User) => {
  return `NOT EXISTS (
      SELECT 1 FROM "_MatchToPicture" as ab
      INNER JOIN "Match" as match ON ab."A" = match.id
      INNER JOIN "Vote" as vote ON match.id = vote."matchId"
      WHERE ab."B" = pic.id AND vote."voterId" = '${loggedUser.id}'
    )`;
};

export const getFirstPic = async (
  gender: Gender,
  loggedUser: User,
  userPreferences: Preference | null
): Promise<(Picture & { gender: Gender }) | null> => {
  let whereArr = [`pic."userId" != '${loggedUser.id}'`, `usr."isBanned" IS FALSE`];

  whereArr = [...whereArr, ...getPhotoPreferencesQueries(userPreferences)];
  whereArr = [...whereArr, ...getVoterPreferencesQueries(loggedUser)];

  if (!isAdmin(loggedUser.role)) {
    whereArr.push(photoCanOnlyBeVotedOnce(loggedUser));
  }

  const where = whereArr.join(" AND ");

  const pictures = (await prisma.$queryRawUnsafe(`
    WITH pic AS (
			SELECT pic.*, usr.gender AS gender
			FROM "Picture" AS pic

			INNER JOIN (
					SELECT u.*,
							CASE 
									WHEN u.gender = '${gender}' THEN 1
									ELSE 2
							END AS gender_priority
					FROM "User" AS u
			) AS usr ON pic."userId" = usr.id

			LEFT JOIN "Preference" AS preference ON usr.id = preference."userId"
			WHERE ${where}
			ORDER BY usr.gender_priority
	)

	SELECT pic.*
	FROM pic
	LEFT JOIN (
			SELECT u.gender AS gender, COUNT(u.gender) AS cnt
			FROM pic AS p
			INNER JOIN "User" AS u
				ON p."userId" = u.id
			WHERE p."isGlobal" = TRUE
			GROUP BY u.gender
	) AS gender_count
			ON pic.gender = gender_count.gender AND gender_count.cnt >= 2
  
  LEFT JOIN (
    SELECT p."userId" AS "userId", COUNT(p."userId") AS has_multiple_private_photos
		FROM pic AS p 
		WHERE p."isGlobal" = FALSE
		GROUP BY p."userId"
	) AS private_pics_extra_info
		ON private_pics_extra_info."userId" = pic."userId" AND private_pics_extra_info.has_multiple_private_photos >= 2 

  WHERE (pic."isGlobal" = FALSE AND private_pics_extra_info."userId" IS NOT NULL) OR (pic."isGlobal" = TRUE AND gender_count.gender IS NOT NULL)
  LIMIT 1
  `)) as any[];

  return pictures.length ? pictures[0] : null;
};
