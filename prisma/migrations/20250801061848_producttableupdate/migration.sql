-- AlterTable
ALTER TABLE "Products" ADD COLUMN     "documentUrl" TEXT,
ADD COLUMN     "imageUrlOne" TEXT,
ADD COLUMN     "imageUrlTwo" TEXT,
ALTER COLUMN "auditorsReportUrl" DROP NOT NULL,
ALTER COLUMN "tokenImageUrl" DROP NOT NULL,
ALTER COLUMN "assetImageUrl" DROP NOT NULL;
