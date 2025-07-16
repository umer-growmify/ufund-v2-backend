/*
  Warnings:

  - The values [SECURE,LOW_RISK,HIGH_RISK] on the enum `RiskScale` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RiskScale_new" AS ENUM ('LOW', 'MEDIUM', 'HIGH');
ALTER TABLE "Products" ALTER COLUMN "riskScale" TYPE "RiskScale_new" USING ("riskScale"::text::"RiskScale_new");
ALTER TYPE "RiskScale" RENAME TO "RiskScale_old";
ALTER TYPE "RiskScale_new" RENAME TO "RiskScale";
DROP TYPE "RiskScale_old";
COMMIT;
