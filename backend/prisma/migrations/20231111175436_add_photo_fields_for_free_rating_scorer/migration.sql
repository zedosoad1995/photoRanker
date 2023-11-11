-- AlterTable
ALTER TABLE "Picture" ADD COLUMN     "freeRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "maxFreeVotes" INTEGER NOT NULL DEFAULT 30;

-- AlterTable
ALTER TABLE "Purchase" ADD COLUMN     "hasUnlimitedVotes" BOOLEAN NOT NULL DEFAULT false;
