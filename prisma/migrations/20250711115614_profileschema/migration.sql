/*
  Warnings:

  - The values [INVESTOR,CAMPAIGNER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('investor', 'campaigner');
ALTER TABLE "User" ALTER COLUMN "roles" TYPE "Role_new"[] USING ("roles"::text::"Role_new"[]);
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropTable
DROP TABLE "Profile";

-- DropEnum
DROP TYPE "BankAccountType";

-- DropEnum
DROP TYPE "IncomeFrequency";

-- DropEnum
DROP TYPE "UserAccountType";
