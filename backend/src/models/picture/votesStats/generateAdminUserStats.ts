import {
  FAKE_AGE_DISTRIBUTION,
  FAKE_COUNTRY_DISTRIBUTION,
  FAKE_MAIN_ETHNICITY,
} from "@/constants/user";
import { pickRandomKey } from "@/helpers/random";
import { IGetPictureVotesStatsQueryReturn } from "./votesStats";
import { Gender } from "@prisma/client";
import _ from "underscore";

export const generateUserStatsWhenAdmin = (stats: IGetPictureVotesStatsQueryReturn[]) => {
  return stats.map((stat) => {
    if (stat.voter_role === "ADMIN") {
      const country = pickRandomKey(FAKE_COUNTRY_DISTRIBUTION);
      //@ts-ignore
      const ethnicity = FAKE_MAIN_ETHNICITY[country];
      const age = pickRandomKey(FAKE_AGE_DISTRIBUTION);
      const gender = Math.random() > 0.5 ? Gender.Female : Gender.Male;

      return _.omit(
        {
          ...stat,
          voter_age: age,
          voter_country: country,
          voter_ethnicity: ethnicity,
          voter_gender: gender,
        },
        "voter_role"
      );
    }

    return _.omit(stat, "voter_role");
  });
};
