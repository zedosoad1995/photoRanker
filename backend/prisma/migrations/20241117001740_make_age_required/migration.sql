/*
  Warnings:

  - Made the column `age` on table `Picture` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Picture" ALTER COLUMN "age" SET NOT NULL;
