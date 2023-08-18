-- CreateTable
CREATE TABLE "Preference" (
    "id" TEXT NOT NULL,
    "contentMinAge" INTEGER,
    "contentMaxAge" INTEGER,
    "contentGender" "Gender",
    "exposureMinAge" INTEGER,
    "exposureMaxAge" INTEGER,
    "exposureGender" "Gender",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Preference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Preference_userId_key" ON "Preference"("userId");

-- AddForeignKey
ALTER TABLE "Preference" ADD CONSTRAINT "Preference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
