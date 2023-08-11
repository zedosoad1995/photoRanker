-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "pictureId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_pictureId_fkey" FOREIGN KEY ("pictureId") REFERENCES "Picture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
