/*
  Warnings:

  - You are about to drop the column `elo` on the `Picture` table. All the data in the column will be lost.
  - Added the required column `rating` to the `Picture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ratingDeviation` to the `Picture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `volatility` to the `Picture` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Picture" DROP COLUMN "elo",
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "ratingDeviation" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "volatility" DOUBLE PRECISION NOT NULL;
