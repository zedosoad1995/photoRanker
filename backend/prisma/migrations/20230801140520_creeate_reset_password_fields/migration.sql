-- AlterTable
ALTER TABLE "User" ADD COLUMN     "resetPasswordExpiration" TIMESTAMP(3),
ADD COLUMN     "resetPasswordToken" TEXT;
