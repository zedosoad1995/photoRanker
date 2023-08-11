/*
  Warnings:

  - You are about to drop the column `userId` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `activeMatchId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[activeUserId]` on the table `Match` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userReportingId` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_userId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_activeMatchId_fkey";

-- DropIndex
DROP INDEX "User_activeMatchId_key";

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "activeUserId" TEXT;

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "userId",
ADD COLUMN     "userReportingId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "activeMatchId";

-- CreateIndex
CREATE UNIQUE INDEX "Match_activeUserId_key" ON "Match"("activeUserId");

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_activeUserId_fkey" FOREIGN KEY ("activeUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_userReportingId_fkey" FOREIGN KEY ("userReportingId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
