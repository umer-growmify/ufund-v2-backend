/*
  Warnings:

  - The values [investor,campaigner] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "UserAccountType" AS ENUM ('INDIVIDUAL', 'MULTIPLE', 'CORPORATE');

-- CreateEnum
CREATE TYPE "IncomeFrequency" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "BankAccountType" AS ENUM ('PERSONAL', 'NON_PERSONAL', 'OTHER');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('INVESTOR', 'CAMPAIGNER');
ALTER TABLE "User" ALTER COLUMN "roles" TYPE "Role_new"[] USING ("roles"::text::"Role_new"[]);
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userAccountType" "UserAccountType" NOT NULL DEFAULT 'INDIVIDUAL',
    "incomeFrequency" "IncomeFrequency",
    "totalAnnualRevenue" DOUBLE PRECISION DEFAULT 0.0,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "zipCode" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "companyName" TEXT,
    "companyEmail" TEXT,
    "companyTelephone" TEXT,
    "companyAddress" TEXT,
    "bankName" TEXT,
    "accountNumber" TEXT,
    "accountName" TEXT,
    "routingNumber" TEXT,
    "ibanNumber" TEXT,
    "swiftNumber" TEXT,
    "bankAccountType" "BankAccountType" DEFAULT 'PERSONAL',
    "bankAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_companyEmail_key" ON "Profile"("companyEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_accountNumber_key" ON "Profile"("accountNumber");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
