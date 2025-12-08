/*
  Warnings:

  - Added the required column `htmlFileName` to the `EmailTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."EmailTemplate" ADD COLUMN     "htmlFileName" TEXT NOT NULL;
