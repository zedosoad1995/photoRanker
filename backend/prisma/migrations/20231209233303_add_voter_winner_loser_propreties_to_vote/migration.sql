/*
  Warnings:

  - You are about to drop the column `voterAge` on the `Vote` table. All the data in the column will be lost.
  - You are about to drop the column `voterCountry` on the `Vote` table. All the data in the column will be lost.
  - You are about to drop the column `voterEthnicity` on the `Vote` table. All the data in the column will be lost.
  - You are about to drop the column `voterGender` on the `Vote` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "voterAge",
DROP COLUMN "voterCountry",
DROP COLUMN "voterEthnicity",
DROP COLUMN "voterGender",
ADD COLUMN     "loserVoterAge" INTEGER,
ADD COLUMN     "loserVoterCountry" TEXT,
ADD COLUMN     "loserVoterEthnicity" TEXT,
ADD COLUMN     "loserVoterGender" "Gender",
ADD COLUMN     "winnerVoterAge" INTEGER,
ADD COLUMN     "winnerVoterCountry" TEXT,
ADD COLUMN     "winnerVoterEthnicity" TEXT,
ADD COLUMN     "winnerVoterGender" "Gender";
