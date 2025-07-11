/*
  Warnings:

  - Made the column `addressLine1` on table `Profile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "addressLine1" SET NOT NULL,
ALTER COLUMN "addressLine2" DROP NOT NULL;
