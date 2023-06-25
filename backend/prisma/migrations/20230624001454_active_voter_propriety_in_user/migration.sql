/*
  Warnings:

  - A unique constraint covering the columns `[activeVoteId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `activeVoteId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `voteId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "activeVoteId" TEXT NOT NULL,
ADD COLUMN     "voteId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_activeVoteId_key" ON "User"("activeVoteId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_activeVoteId_fkey" FOREIGN KEY ("activeVoteId") REFERENCES "Vote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
