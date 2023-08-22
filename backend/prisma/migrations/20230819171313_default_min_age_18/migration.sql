/*
  Warnings:

  - Made the column `contentMinAge` on table `Preference` required. This step will fail if there are existing NULL values in that column.
  - Made the column `exposureMinAge` on table `Preference` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Preference" ALTER COLUMN "contentMinAge" SET NOT NULL,
ALTER COLUMN "contentMinAge" SET DEFAULT 18,
ALTER COLUMN "exposureMinAge" SET NOT NULL,
ALTER COLUMN "exposureMinAge" SET DEFAULT 18;
