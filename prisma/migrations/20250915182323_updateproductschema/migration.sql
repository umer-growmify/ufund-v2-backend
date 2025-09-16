-- AlterTable
ALTER TABLE "public"."Products" ALTER COLUMN "adminCommission" DROP NOT NULL,
ALTER COLUMN "unitPrice" SET DATA TYPE TEXT;
