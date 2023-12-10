import { IGetPictureVotesStatsQueryReturn } from "./votesStats";
import _ from "underscore";

export const generateUserStatsWhenAdmin = (stats: IGetPictureVotesStatsQueryReturn[]) => {
  return stats.map((stat) => {
    if (stat.fake_age && stat.fake_country && stat.fake_ethnicity && stat.fake_gender) {
      return _.omit(
        {
          ...stat,
          voter_age: stat.fake_age,
          voter_country: stat.fake_country,
          voter_ethnicity: stat.fake_ethnicity,
          voter_gender: stat.fake_gender,
        },
        "fake_age",
        "fake_gender",
        "fake_country",
        "fake_ethnicity"
      );
    }

    return _.omit(stat, "fake_age", "fake_gender", "fake_country", "fake_ethnicity");
  });
};
