-- CreateEnum
CREATE TYPE "RiskScale" AS ENUM ('SECURE', 'LOW_RISK', 'HIGH_RISK');

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- CreateTable
CREATE TABLE "AssetType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssetType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TokenType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Products" (
    "id" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "numberOfProducts" INTEGER NOT NULL,
    "hsCode" TEXT NOT NULL,
    "eanCode" TEXT NOT NULL,
    "upcCode" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "totalValue" DOUBLE PRECISION NOT NULL,
    "investmentProfit" DOUBLE PRECISION NOT NULL,
    "adminCommission" DOUBLE PRECISION NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "productTotalValue" DOUBLE PRECISION NOT NULL,
    "campaignerId" TEXT,
    "description" TEXT NOT NULL,
    "riskScale" "RiskScale" NOT NULL,
    "offerStartDate" TIMESTAMP(3) NOT NULL,
    "offerEndDate" TIMESTAMP(3) NOT NULL,
    "investmentStartDate" TIMESTAMP(3) NOT NULL,
    "maturityCountDays" INTEGER NOT NULL,
    "maturityDate" TIMESTAMP(3) NOT NULL,
    "auditorsReportUrl" TEXT NOT NULL,
    "tokenImageUrl" TEXT NOT NULL,
    "assetImageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AssetType_name_key" ON "AssetType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TokenType_name_key" ON "TokenType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Products_categoryId_key" ON "Products"("categoryId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_campaignerId_fkey" FOREIGN KEY ("campaignerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
