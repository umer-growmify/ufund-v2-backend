-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('PENDING', 'LIVE', 'SOLD', 'REJECTED');

-- AlterTable
ALTER TABLE "public"."Products" ADD COLUMN     "status" "public"."Status" NOT NULL DEFAULT 'PENDING';
