import {
  FAKE_AGE_DISTRIBUTION,
  FAKE_COUNTRY_DISTRIBUTION,
  FAKE_MAIN_ETHNICITY,
  FAKE_OTHER_RACE_PROB,
} from "@/constants/user";
import { pickRandomKey } from "@/helpers/random";
import { Gender, PrismaClient, UserRole } from "@prisma/client";
import { ETHNICITY } from "@shared/constants/user";
import { calculateAge } from "@shared/helpers/date";
const prisma = new PrismaClient();

async function main() {
  const userIds = (
    await prisma.user.findMany({
      where: {
        OR: [{ role: UserRole.ADMIN }, { canBypassPreferences: true }],
      },
    })
  ).map((u) => u.id);

  const votes = await prisma.vote.findMany({
    where: {
      voterId: {
        in: userIds,
      },
    },
    include: {
      match: {
        include: {
          pictures: {
            include: {
              user: {
                include: {
                  preference: true,
                },
              },
            },
          },
        },
      },
      voter: true,
    },
  });

  for (const vote of votes) {
    if (vote.match.pictures.length !== 2) {
      continue;
    }

    const winnerPic = vote.match.pictures.find((p) => p.id === vote.winnerPictureId);
    if (!winnerPic) {
      continue;
    }

    const loserPic = vote.match.pictures.find((p) => p.id !== vote.winnerPictureId);
    if (!loserPic) {
      continue;
    }

    let winnerVoterInfo: Partial<{
      winnerVoterCountry: string;
      winnerVoterEthnicity: string;
      winnerVoterAge: number;
      winnerVoterGender: Gender;
    }> = {};

    let loserVoterInfo: Partial<{
      loserVoterCountry: string;
      loserVoterEthnicity: string;
      loserVoterAge: number;
      loserVoterGender: Gender;
    }> = {};

    const winnerPreference = winnerPic.user.preference;
    if (winnerPreference) {
      const hasVoterValidAge =
        vote.voter.dateOfBirth &&
        calculateAge(vote.voter.dateOfBirth) >= winnerPreference.exposureMinAge &&
        (!winnerPreference.exposureMaxAge ||
          calculateAge(vote.voter.dateOfBirth) <= winnerPreference.exposureMaxAge);

      const hasVoterValidGender =
        !winnerPreference.exposureGender || winnerPreference.exposureGender === vote.voter.gender;

      if (hasVoterValidAge && hasVoterValidGender && vote.voter.role !== UserRole.ADMIN) {
        continue;
      }

      const filteredAgeDistribution = Object.fromEntries(
        Object.entries(FAKE_AGE_DISTRIBUTION).filter(
          ([k, v]) =>
            Number(k) >= winnerPreference.exposureMinAge &&
            (!winnerPreference.exposureMaxAge || Number(k) <= winnerPreference.exposureMaxAge)
        )
      );

      if (Object.keys(filteredAgeDistribution).length === 0) {
        filteredAgeDistribution[25] = 1;
      }

      const age = Number(pickRandomKey(filteredAgeDistribution));
      winnerVoterInfo.winnerVoterAge = age;

      if (winnerPreference.exposureGender) {
        winnerVoterInfo.winnerVoterGender = winnerPreference.exposureGender;
      } else {
        const gender = Math.random() > 0.5 ? Gender.Female : Gender.Male;
        winnerVoterInfo.winnerVoterGender = gender;
      }
    } else {
      const age = Number(pickRandomKey(FAKE_AGE_DISTRIBUTION));
      const gender = Math.random() > 0.5 ? Gender.Female : Gender.Male;
      winnerVoterInfo.winnerVoterAge = age;
      winnerVoterInfo.winnerVoterGender = gender;
    }

    const loserPreference = loserPic.user.preference;
    if (loserPreference) {
      const hasVoterValidAge =
        vote.voter.dateOfBirth &&
        calculateAge(vote.voter.dateOfBirth) >= loserPreference.exposureMinAge &&
        (!loserPreference.exposureMaxAge ||
          calculateAge(vote.voter.dateOfBirth) <= loserPreference.exposureMaxAge);

      const hasVoterValidGender =
        !loserPreference.exposureGender || loserPreference.exposureGender === vote.voter.gender;

      if (hasVoterValidAge && hasVoterValidGender && vote.voter.role !== UserRole.ADMIN) {
        continue;
      }

      const filteredAgeDistribution = Object.fromEntries(
        Object.entries(FAKE_AGE_DISTRIBUTION).filter(
          ([k, v]) =>
            Number(k) >= loserPreference.exposureMinAge &&
            (!loserPreference.exposureMaxAge || Number(k) <= loserPreference.exposureMaxAge)
        )
      );

      if (Object.keys(filteredAgeDistribution).length === 0) {
        filteredAgeDistribution[25] = 1;
      }

      const age = Number(pickRandomKey(filteredAgeDistribution));
      loserVoterInfo.loserVoterAge = age;

      if (loserPreference.exposureGender) {
        loserVoterInfo.loserVoterGender = loserPreference.exposureGender;
      } else {
        const gender = Math.random() > 0.5 ? Gender.Female : Gender.Male;
        loserVoterInfo.loserVoterGender = gender;
      }
    } else {
      const age = Number(pickRandomKey(FAKE_AGE_DISTRIBUTION));
      const gender = Math.random() > 0.5 ? Gender.Female : Gender.Male;
      loserVoterInfo.loserVoterAge = age;
      loserVoterInfo.loserVoterGender = gender;
    }

    const country = pickRandomKey(FAKE_COUNTRY_DISTRIBUTION);
    let ethnicity = FAKE_MAIN_ETHNICITY[country];
    if (Math.random() > 1 - FAKE_OTHER_RACE_PROB[country]) {
      ethnicity = ETHNICITY[Math.floor(Math.random() * ETHNICITY.length)];
    }

    loserVoterInfo = {
      ...loserVoterInfo,
      loserVoterCountry: country,
      loserVoterEthnicity: ethnicity,
    };

    winnerVoterInfo = {
      ...winnerVoterInfo,
      winnerVoterCountry: country,
      winnerVoterEthnicity: ethnicity,
    };

    await prisma.vote.update({
      where: {
        id: vote.id,
      },
      data: {
        ...loserVoterInfo,
        ...winnerVoterInfo,
      },
    });
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
