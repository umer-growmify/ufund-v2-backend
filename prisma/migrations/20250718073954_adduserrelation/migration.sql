/*
  Warnings:

  - You are about to drop the column `campaignerId` on the `Products` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Products" DROP CONSTRAINT "Products_campaignerId_fkey";

-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "Products" DROP COLUMN "campaignerId",
ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
