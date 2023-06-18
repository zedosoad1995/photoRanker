-- CreateTable
CREATE TABLE "Picture" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "elo" DOUBLE PRECISION NOT NULL,
    "numVotes" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Picture_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Picture" ADD CONSTRAINT "Picture_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
