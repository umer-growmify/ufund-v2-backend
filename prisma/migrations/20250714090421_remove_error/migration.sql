-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('PRODUCT', 'TOKEN');

-- AlterTable
ALTER TABLE "Admin" ALTER COLUMN "role" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL DEFAULT 'https://example.com/default-category-image.png',
    "categoryType" "CategoryType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
