-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('investor', 'campaigner');

-- CreateEnum
CREATE TYPE "UserAccountType" AS ENUM ('INDIVIDUAL', 'MULTIPLE', 'CORPORATE');

-- CreateEnum
CREATE TYPE "IncomeFrequencyType" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "BankAccountType" AS ENUM ('PERSONAL', 'NON_PERSONAL', 'OTHER');

-- CreateEnum
CREATE TYPE "AdminRoleType" AS ENUM ('SUPER_ADMIN', 'NOTIFICATION_COMMUNICATION', 'KYC_COMPLIANCE', 'PRODUCT_CROWDFUNDING', 'TOKEN_MANAGEMENT', 'FINANCE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "countryCode" TEXT,
    "password" TEXT,
    "roles" "RoleType"[],
    "agreedToTerms" BOOLEAN NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationToken" TEXT,
    "provider" TEXT,
    "providerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userAccountType" "UserAccountType" NOT NULL DEFAULT 'INDIVIDUAL',
    "incomeFrequency" "IncomeFrequencyType" NOT NULL DEFAULT 'MONTHLY',
    "totalAnnualRevenue" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "zipCode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyEmail" TEXT NOT NULL,
    "companyTelephone" TEXT NOT NULL,
    "companyAddress" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "routingNumber" TEXT NOT NULL,
    "ibanNumber" TEXT NOT NULL,
    "swiftNumber" TEXT NOT NULL,
    "bankAccountType" "BankAccountType" NOT NULL DEFAULT 'PERSONAL',
    "bankAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "AdminRoleType" NOT NULL DEFAULT 'SUPER_ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
