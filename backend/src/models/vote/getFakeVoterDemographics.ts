import { isAdmin, isRegular } from "@/helpers/role";
import { ILoggedUserMiddleware } from "@/types/user";
import { PreferenceModel } from "../preference";
import { calculateAge } from "@shared/helpers/date";
import {
  FAKE_AGE_DISTRIBUTION,
  FAKE_COUNTRY_DISTRIBUTION,
  FAKE_MAIN_ETHNICITY,
  FAKE_OTHER_RACE_PROB,
} from "@/constants/user";
import { pickRandomKey } from "@/helpers/random";
import { Gender } from "@prisma/client";
import { ETHNICITY } from "@shared/constants/user";

const isAgeValid = (age: number, minAge: number, maxAge: number | null) => {
  return age >= minAge && (maxAge === null || age <= maxAge);
};

export const getFakeVoterDemographics = async (
  loggedUser: ILoggedUserMiddleware,
  pictureUserId?: string
) => {
  if (isRegular(loggedUser.role) && !loggedUser.canBypassPreferences) {
    return;
  }

  let voterInfo: Partial<{
    country: string;
    ethnicity: string;
    age: number;
    gender: Gender;
  }> = {};

  const preference = await PreferenceModel.findUnique({
    where: {
      userId: pictureUserId,
    },
  });

  if (preference) {
    const voterAge = calculateAge(loggedUser.dateOfBirth);

    const hasValidAge = isAgeValid(voterAge, preference.exposureMinAge, preference.exposureMaxAge);

    const hasValidGender =
      !preference.exposureGender || preference.exposureGender === loggedUser.gender;

    if (hasValidAge && hasValidGender && isRegular(loggedUser.role)) {
      return;
    }

    const filteredAgeDistribution = Object.fromEntries(
      Object.entries(FAKE_AGE_DISTRIBUTION).filter(([age, _]) =>
        isAgeValid(Number(age), preference.exposureMinAge, preference.exposureMaxAge)
      )
    );

    if (Object.keys(filteredAgeDistribution).length === 0) {
      filteredAgeDistribution[25] = 1;
    }

    const randomAge = Number(pickRandomKey(filteredAgeDistribution));
    voterInfo.age = randomAge;

    if (preference.exposureGender) {
      voterInfo.gender = preference.exposureGender;
    } else {
      const randomGender = Math.random() < 0.4 ? Gender.Female : Gender.Male;
      voterInfo.gender = randomGender;
    }
  } else {
    if (isRegular(loggedUser.role)) {
      return;
    }

    const randomAge = Number(pickRandomKey(FAKE_AGE_DISTRIBUTION));
    const randomGender = Math.random() < 0.4 ? Gender.Female : Gender.Male;
    voterInfo.age = randomAge;
    voterInfo.gender = randomGender;
  }

  if (isAdmin(loggedUser.role)) {
    const randomCountry = pickRandomKey(FAKE_COUNTRY_DISTRIBUTION);
    const randomEthnicity =
      Math.random() < FAKE_OTHER_RACE_PROB[randomCountry]
        ? ETHNICITY[Math.floor(Math.random() * ETHNICITY.length)]
        : FAKE_MAIN_ETHNICITY[randomCountry];

    voterInfo = {
      ...voterInfo,
      country: randomCountry,
      ethnicity: randomEthnicity,
    };
  }

  return voterInfo;
};
