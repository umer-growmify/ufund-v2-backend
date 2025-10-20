import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InvestorService {
  constructor(private readonly prisma: PrismaService) {}

  async investorDashboard() {
    const result: any = await this.prisma.$queryRaw`
    WITH category_stats AS (
      SELECT 
        COUNT(*) as total_categories,
        COUNT(*) FILTER (WHERE "categoryType" = 'PRODUCT') as product_categories,
        COUNT(*) FILTER (WHERE "categoryType" = 'TOKEN') as token_categories
      FROM "Category"
    ),
    product_stats AS (
      SELECT 
        COUNT(*) as total_products,
        COUNT(*) FILTER (WHERE "createdAt" >= CURRENT_DATE - INTERVAL '7 days') as new_products
      FROM "Products"
    ),
    asset_stats AS (
      SELECT 
        COUNT(*) as total_assets,
        COUNT(*) FILTER (WHERE "createdAt" >= CURRENT_DATE - INTERVAL '7 days') as new_assets
      FROM "Asset"
    )
    SELECT 
      cs.total_categories as "totalCategories",
      cs.product_categories as "totalProductCategories",
      cs.token_categories as "totalTokenCategories",
      ps.total_products as "totalProducts",
      ps.new_products as "newProducts",
      ast.total_assets as "totalAssets",
      ast.new_assets as "newAssets"
    FROM category_stats cs, product_stats ps, asset_stats ast
  `;

    const data = result[0];

    return {
      success: true,
      message: 'Investor dashboard retrieved successfully',
      data: {
        categories: {
          totalCategories: Number(data.totalCategories),
          totalProductCategories: Number(data.totalProductCategories),
          totalTokenCategories: Number(data.totalTokenCategories),
        },
        products: {
          totalProducts: Number(data.totalProducts),
          newProducts: Number(data.newProducts),
        },
        assets: {
          totalAssets: Number(data.totalAssets),
          newAssets: Number(data.newAssets),
        },
      },
    };
  }
}
