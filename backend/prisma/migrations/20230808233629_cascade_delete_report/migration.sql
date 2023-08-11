-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_pictureId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_userReportingId_fkey";

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_pictureId_fkey" FOREIGN KEY ("pictureId") REFERENCES "Picture"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_userReportingId_fkey" FOREIGN KEY ("userReportingId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
