-- CreateTable
CREATE TABLE "Asset" (
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
    "rewardDescription" TEXT,
    "riskScale" "RiskScale" NOT NULL,
    "auditorsReportUrl" TEXT NOT NULL,
    "tokenImageUrl" TEXT NOT NULL,
    "assetImageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Asset_categoryId_key" ON "Asset"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Asset_assetTypeId_key" ON "Asset"("assetTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "Asset_tokenTypeId_key" ON "Asset"("tokenTypeId");

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_assetTypeId_fkey" FOREIGN KEY ("assetTypeId") REFERENCES "AssetType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_tokenTypeId_fkey" FOREIGN KEY ("tokenTypeId") REFERENCES "TokenType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
