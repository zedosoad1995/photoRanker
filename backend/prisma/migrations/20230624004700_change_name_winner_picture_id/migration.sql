/*
  Warnings:

  - You are about to drop the column `pictureId` on the `Vote` table. All the data in the column will be lost.
  - Added the required column `winnerPictureId` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_pictureId_fkey";

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "pictureId",
ADD COLUMN     "winnerPictureId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_winnerPictureId_fkey" FOREIGN KEY ("winnerPictureId") REFERENCES "Picture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
