/*
  Warnings:

  - You are about to drop the column `userId` on the `Asset` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Asset" DROP CONSTRAINT "Asset_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Asset" DROP COLUMN "userId";
