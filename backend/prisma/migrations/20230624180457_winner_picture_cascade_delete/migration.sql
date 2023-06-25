-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_winnerPictureId_fkey";

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_winnerPictureId_fkey" FOREIGN KEY ("winnerPictureId") REFERENCES "Picture"("id") ON DELETE CASCADE ON UPDATE CASCADE;
