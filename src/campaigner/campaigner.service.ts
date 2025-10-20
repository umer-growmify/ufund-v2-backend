import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CampaignerService {
  constructor(private readonly prisma: PrismaService) {}

  async campaignerDashboard() {
    const productResult: any = await this.prisma.$queryRaw`
    SELECT 
      COUNT(*) as totalProducts,
      COUNT(CASE WHEN status = 'LIVE' THEN 1 END) as approvedProducts,
      COUNT(CASE WHEN status = 'PENDING' THEN 1 END) as pendingProducts,
      COUNT(CASE WHEN status = 'REJECTED' THEN 1 END) as rejectedProducts,
      COUNT(CASE WHEN status = 'SOLD' THEN 1 END) as soldProducts
    FROM "Products"
  `;

    const productData = productResult[0];

    const assetsResult: any = await this.prisma.$queryRaw`
    SELECT 
      COUNT(*) as totalAssets,
      COUNT(CASE WHEN status = 'LIVE' THEN 1 END) as approvedAssets,
      COUNT(CASE WHEN status = 'PENDING' THEN 1 END) as pendingAssets,
      COUNT(CASE WHEN status = 'REJECTED' THEN 1 END) as rejectedAssets,
      COUNT(CASE WHEN status = 'SOLD' THEN 1 END) as soldAssets
    FROM "Asset"
  `;

    const assetsData = assetsResult[0];

    return {
      success: true,
      message: 'Campaigner dashboard retrieved successfully',
      data: {
        products: {
          totalProducts: Number(productData.totalproducts),
          approvedProducts: Number(productData.approvedproducts),
          pendingProducts: Number(productData.pendingproducts),
          rejectedProducts: Number(productData.rejectedproducts),
          soldProducts: Number(productData.soldproducts),
        },
        assets: {
          totalAssets: Number(assetsData.totalassets),
          approvedAssets: Number(assetsData.approvedassets),
          pendingAssets: Number(assetsData.pendingassets),
          rejectedAssets: Number(assetsData.rejectedassets),
          soldAssets: Number(assetsData.soldassets),
        },
      },
    };
  }
}
