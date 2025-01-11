import { isAdmin, isRegular } from "@/helpers/role";
import { ILoggedUser } from "@/types/user";
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

const generateAge = (minAge: number, maxAge: number | null) => {
  const filteredAgeDistribution = Object.fromEntries(
    Object.entries(FAKE_AGE_DISTRIBUTION).filter(([age, _]) =>
      isAgeValid(Number(age), minAge, maxAge),
    ),
  );

  if (Object.keys(filteredAgeDistribution).length === 0) {
    filteredAgeDistribution[25] = 1;
  }

  return Number(pickRandomKey(filteredAgeDistribution));
};

const generateGender = (desiredGender: Gender | null) => {
  if (desiredGender) {
    return desiredGender;
  } else {
    return Math.random() < 0.4 ? Gender.Female : Gender.Male;
  }
};

const isGenderValid = (gender: Gender, desiredGender: Gender | null) => {
  return desiredGender === null || desiredGender === gender;
};

const isAgeValid = (age: number, minAge: number, maxAge: number | null) => {
  return age >= minAge && (maxAge === null || age <= maxAge);
};

type IVoterInfo = Partial<{
  country: string;
  ethnicity: string;
  age: number;
  gender: Gender;
}>;

export const getFakeVoterDemographics = async (
  loggedUser: ILoggedUser,
  pictureUserId?: string,
  otherVoterInfo?: IVoterInfo,
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

  const preference = pictureUserId
    ? await PreferenceModel.findUnique({
        where: {
          userId: pictureUserId,
        },
      })
    : undefined;

  if (preference) {
    if (otherVoterInfo?.age && otherVoterInfo.gender) {
      const hasOtherUserValidAge = isAgeValid(
        otherVoterInfo.age,
        preference.exposureMinAge,
        preference.exposureMaxAge,
      );

      const hasOtherUserValidGender = isGenderValid(
        otherVoterInfo.gender,
        preference.exposureGender,
      );

      if (hasOtherUserValidAge && hasOtherUserValidGender) {
        return otherVoterInfo;
      }
    }

    const voterAge = calculateAge(loggedUser.dateOfBirth);
    const hasValidAge = isAgeValid(voterAge, preference.exposureMinAge, preference.exposureMaxAge);
    const hasValidGender = isGenderValid(loggedUser.gender, preference.exposureGender);

    if (hasValidAge && hasValidGender && isRegular(loggedUser.role)) {
      return;
    }

    if ((!hasValidAge && isRegular(loggedUser.role)) || isAdmin(loggedUser.role)) {
      voterInfo.age = generateAge(preference.exposureMinAge, preference.exposureMaxAge);
    }

    if ((!hasValidGender && isRegular(loggedUser.role)) || isAdmin(loggedUser.role)) {
      voterInfo.gender = generateGender(preference.exposureGender);
    }
  } else {
    if (otherVoterInfo?.age && otherVoterInfo.gender) {
      return otherVoterInfo;
    }

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
