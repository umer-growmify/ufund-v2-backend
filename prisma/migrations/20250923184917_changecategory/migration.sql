-- AlterTable
ALTER TABLE "public"."Category" ALTER COLUMN "imageUrl" DROP NOT NULL,
ALTER COLUMN "imageUrl" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."Products" ALTER COLUMN "categoryId" DROP NOT NULL;
