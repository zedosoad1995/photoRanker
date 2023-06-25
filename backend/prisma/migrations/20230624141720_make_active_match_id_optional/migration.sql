-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_activeMatchId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "activeMatchId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_activeMatchId_fkey" FOREIGN KEY ("activeMatchId") REFERENCES "Match"("id") ON DELETE SET NULL ON UPDATE CASCADE;
