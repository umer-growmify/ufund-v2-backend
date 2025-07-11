/*
  Warnings:

  - Made the column `addressLine2` on table `Profile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `zipCode` on table `Profile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `city` on table `Profile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `state` on table `Profile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `country` on table `Profile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `companyName` on table `Profile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `companyEmail` on table `Profile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `companyTelephone` on table `Profile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `companyAddress` on table `Profile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bankName` on table `Profile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `accountNumber` on table `Profile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `accountName` on table `Profile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `routingNumber` on table `Profile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ibanNumber` on table `Profile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `swiftNumber` on table `Profile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bankAccountType` on table `Profile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bankAddress` on table `Profile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "addressLine2" SET NOT NULL,
ALTER COLUMN "zipCode" SET NOT NULL,
ALTER COLUMN "city" SET NOT NULL,
ALTER COLUMN "state" SET NOT NULL,
ALTER COLUMN "country" SET NOT NULL,
ALTER COLUMN "companyName" SET NOT NULL,
ALTER COLUMN "companyEmail" SET NOT NULL,
ALTER COLUMN "companyTelephone" SET NOT NULL,
ALTER COLUMN "companyAddress" SET NOT NULL,
ALTER COLUMN "bankName" SET NOT NULL,
ALTER COLUMN "accountNumber" SET NOT NULL,
ALTER COLUMN "accountName" SET NOT NULL,
ALTER COLUMN "routingNumber" SET NOT NULL,
ALTER COLUMN "ibanNumber" SET NOT NULL,
ALTER COLUMN "swiftNumber" SET NOT NULL,
ALTER COLUMN "bankAccountType" SET NOT NULL,
ALTER COLUMN "bankAddress" SET NOT NULL;
