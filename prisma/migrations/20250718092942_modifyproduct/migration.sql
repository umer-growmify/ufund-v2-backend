/*
  Warnings:

  - You are about to drop the column `userId` on the `Products` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Products" DROP CONSTRAINT "Products_userId_fkey";

-- AlterTable
ALTER TABLE "Products" DROP COLUMN "userId",
ADD COLUMN     "campaignerId" TEXT,
ADD COLUMN     "creatorId" TEXT;

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_campaignerId_fkey" FOREIGN KEY ("campaignerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
