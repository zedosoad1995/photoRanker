import { prisma } from "..";
import { getFakeVoterDemographics } from "./getFakeVoterDemographics";

export const VoteModel = { ...prisma.vote, getFakeVoterDemographics };
