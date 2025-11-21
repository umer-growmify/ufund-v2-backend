-- CreateEnum
CREATE TYPE "public"."RoleType" AS ENUM ('investor', 'campaigner');

-- CreateEnum
CREATE TYPE "public"."UserAccountType" AS ENUM ('INDIVIDUAL', 'MULTIPLE', 'CORPORATE');

-- CreateEnum
CREATE TYPE "public"."IncomeFrequencyType" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "public"."BankAccountType" AS ENUM ('PERSONAL', 'NON_PERSONAL', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."AdminRoleType" AS ENUM ('SUPER_ADMIN', 'NOTIFICATION_COMMUNICATION', 'KYC_COMPLIANCE', 'PRODUCT_CROWDFUNDING', 'TOKEN_MANAGEMENT', 'FINANCE');

-- CreateEnum
CREATE TYPE "public"."CategoryType" AS ENUM ('PRODUCT', 'TOKEN');

-- CreateEnum
CREATE TYPE "public"."RiskScale" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('PENDING', 'LIVE', 'SOLD', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."UserStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "countryCode" TEXT,
    "password" TEXT,
    "roles" "public"."RoleType"[],
    "agreedToTerms" BOOLEAN NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationToken" TEXT,
    "provider" TEXT,
    "providerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "public"."UserStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userAccountType" "public"."UserAccountType" NOT NULL DEFAULT 'INDIVIDUAL',
    "incomeFrequency" "public"."IncomeFrequencyType" NOT NULL DEFAULT 'MONTHLY',
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
    "bankAccountType" "public"."BankAccountType" NOT NULL DEFAULT 'PERSONAL',
    "bankAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "imageKey" TEXT,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Admin" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."AdminRoleType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT,
    "categoryType" "public"."CategoryType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "block" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AssetType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssetType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TokenType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TokenType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Products" (
    "id" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "numberOfProducts" TEXT NOT NULL,
    "hsCode" TEXT NOT NULL,
    "eanCode" TEXT NOT NULL,
    "upcCode" TEXT NOT NULL,
    "categoryId" TEXT,
    "totalValue" TEXT NOT NULL,
    "investmentProfit" DOUBLE PRECISION NOT NULL,
    "adminCommission" DOUBLE PRECISION,
    "unitPrice" TEXT,
    "productTotalValue" DOUBLE PRECISION,
    "description" TEXT NOT NULL,
    "riskScale" "public"."RiskScale" NOT NULL,
    "offerStartDate" TIMESTAMP(3) NOT NULL,
    "offerEndDate" TIMESTAMP(3) NOT NULL,
    "investmentStartDate" TIMESTAMP(3) NOT NULL,
    "maturityCountDays" INTEGER NOT NULL,
    "maturityDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "campaignerId" TEXT,
    "creatorId" TEXT,
    "assetImageKey" TEXT,
    "auditorsReportKey" TEXT,
    "documentKey" TEXT,
    "imageOneKey" TEXT,
    "imageTwoKey" TEXT,
    "tokenImageKey" TEXT,
    "status" "public"."Status" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Asset" (
    "id" TEXT NOT NULL,
    "assetName" TEXT NOT NULL,
    "tokenName" TEXT NOT NULL,
    "tokenValue" TEXT NOT NULL,
    "tokenSymbol" TEXT NOT NULL,
    "tokenSupply" TEXT NOT NULL,
    "decimal" INTEGER NOT NULL,
    "auditorsName" TEXT NOT NULL,
    "adminCommission" DOUBLE PRECISION NOT NULL,
    "assetValue" DOUBLE PRECISION NOT NULL,
    "categoryId" TEXT NOT NULL,
    "assetTypeId" TEXT NOT NULL,
    "tokenTypeId" TEXT NOT NULL,
    "offerStartDate" TIMESTAMP(3) NOT NULL,
    "offerEndDate" TIMESTAMP(3) NOT NULL,
    "rewardDate" TIMESTAMP(3),
    "riskScale" "public"."RiskScale" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "creatorId" TEXT,
    "assetImageKey" TEXT,
    "auditorsReportKey" TEXT,
    "contractTemplate" TEXT,
    "description" TEXT,
    "documentKey" TEXT,
    "imageOneKey" TEXT,
    "imageTwoKey" TEXT,
    "network" TEXT,
    "productImageKey" TEXT,
    "reward" TEXT,
    "status" "public"."Status" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RefreshToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT,
    "adminId" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "public"."Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "public"."Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "public"."Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AssetType_name_key" ON "public"."AssetType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TokenType_name_key" ON "public"."TokenType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "public"."RefreshToken"("token");

-- AddForeignKey
ALTER TABLE "public"."Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Products" ADD CONSTRAINT "Products_campaignerId_fkey" FOREIGN KEY ("campaignerId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Products" ADD CONSTRAINT "Products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Asset" ADD CONSTRAINT "Asset_assetTypeId_fkey" FOREIGN KEY ("assetTypeId") REFERENCES "public"."AssetType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Asset" ADD CONSTRAINT "Asset_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Asset" ADD CONSTRAINT "Asset_tokenTypeId_fkey" FOREIGN KEY ("tokenTypeId") REFERENCES "public"."TokenType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RefreshToken" ADD CONSTRAINT "RefreshToken_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "public"."Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
