/*
  Warnings:

  - You are about to drop the column `assetImageUrl` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `auditorsReportUrl` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `rewardDescription` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `tokenImageUrl` on the `Asset` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Asset" DROP COLUMN "assetImageUrl",
DROP COLUMN "auditorsReportUrl",
DROP COLUMN "rewardDescription",
DROP COLUMN "tokenImageUrl",
ADD COLUMN     "assetImageKey" TEXT,
ADD COLUMN     "auditorsReportKey" TEXT,
ADD COLUMN     "contractTemplate" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "documentKey" TEXT,
ADD COLUMN     "imageOneKey" TEXT,
ADD COLUMN     "imageTwoKey" TEXT,
ADD COLUMN     "network" TEXT,
ADD COLUMN     "productImageKey" TEXT,
ADD COLUMN     "reward" TEXT;
