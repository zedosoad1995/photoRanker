/*
  Warnings:

  - You are about to drop the column `activeVoteId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `_PictureToVote` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[activeMatchId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[matchId]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `activeMatchId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `matchId` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_activeVoteId_fkey";

-- DropForeignKey
ALTER TABLE "_PictureToVote" DROP CONSTRAINT "_PictureToVote_A_fkey";

-- DropForeignKey
ALTER TABLE "_PictureToVote" DROP CONSTRAINT "_PictureToVote_B_fkey";

-- DropIndex
DROP INDEX "User_activeVoteId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "activeVoteId",
ADD COLUMN     "activeMatchId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Vote" ADD COLUMN     "matchId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_PictureToVote";

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MatchToPicture" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MatchToPicture_AB_unique" ON "_MatchToPicture"("A", "B");

-- CreateIndex
CREATE INDEX "_MatchToPicture_B_index" ON "_MatchToPicture"("B");

-- CreateIndex
CREATE UNIQUE INDEX "User_activeMatchId_key" ON "User"("activeMatchId");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_matchId_key" ON "Vote"("matchId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_activeMatchId_fkey" FOREIGN KEY ("activeMatchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MatchToPicture" ADD CONSTRAINT "_MatchToPicture_A_fkey" FOREIGN KEY ("A") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MatchToPicture" ADD CONSTRAINT "_MatchToPicture_B_fkey" FOREIGN KEY ("B") REFERENCES "Picture"("id") ON DELETE CASCADE ON UPDATE CASCADE;
