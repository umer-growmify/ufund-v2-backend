/*
  Warnings:

  - The `incomeFrequency` column on the `Profile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `roles` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('investor', 'campaigner');

-- CreateEnum
CREATE TYPE "IncomeFrequencyType" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "incomeFrequency",
ADD COLUMN     "incomeFrequency" "IncomeFrequencyType" NOT NULL DEFAULT 'MONTHLY';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "roles",
ADD COLUMN     "roles" "RoleType"[];

-- DropEnum
DROP TYPE "IncomeFrequency";

-- DropEnum
DROP TYPE "Role";
