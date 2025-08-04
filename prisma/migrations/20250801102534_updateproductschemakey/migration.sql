/*
  Warnings:

  - You are about to drop the column `assetImageUrl` on the `Products` table. All the data in the column will be lost.
  - You are about to drop the column `auditorsReportUrl` on the `Products` table. All the data in the column will be lost.
  - You are about to drop the column `documentUrl` on the `Products` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrlOne` on the `Products` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrlTwo` on the `Products` table. All the data in the column will be lost.
  - You are about to drop the column `tokenImageUrl` on the `Products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Products" DROP COLUMN "assetImageUrl",
DROP COLUMN "auditorsReportUrl",
DROP COLUMN "documentUrl",
DROP COLUMN "imageUrlOne",
DROP COLUMN "imageUrlTwo",
DROP COLUMN "tokenImageUrl",
ADD COLUMN     "assetImageKey" TEXT,
ADD COLUMN     "auditorsReportKey" TEXT,
ADD COLUMN     "documentKey" TEXT,
ADD COLUMN     "imageOneKey" TEXT,
ADD COLUMN     "imageTwoKey" TEXT,
ADD COLUMN     "tokenImageKey" TEXT;
