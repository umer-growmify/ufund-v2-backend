import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/category.dto';
import { AwsService } from 'src/aws/aws.service';

@Injectable()
export class CategoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly awsService: AwsService,
  ) {}

  async createCategory(createCategoryDto: CreateCategoryDto, file?: any) {
    let imageKey: string | undefined;
    let imageUrl: string | undefined;
    if (file) {
      const { key, url } = await this.awsService.uploadFile(
        file,
        createCategoryDto.name,
        'categories',
      );
      imageKey = key;
      imageUrl = url;
    }

    try {
      const createCategory = await this.prisma.category.create({
        data: {
          name: createCategoryDto.name,
          imageUrl: imageKey,
          categoryType: createCategoryDto.categoryType,
        },
      });

      return {
        success: true,
        message: 'Category created successfully',
        data: createCategory,
        imageUrl,
      };
    } catch (error) {
      throw new NotFoundException('Category creation failed');
    }
  }

  async getAllProductCategories() {
    try {
      const categories = await this.prisma.category.findMany({
        where: { categoryType: 'PRODUCT' },
      });

      if (!categories || categories.length === 0) {
        throw new NotFoundException('No categories found');
      }

      // Get the current date and calculate the start of the month
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Get product counts for each category
      const categoriesWithCounts = await Promise.all(
        categories.map(async (category) => {
          // Get total products in this category
          const totalProducts = await this.prisma.products.count({
            where: { categoryId: category.id },
          });

          // Get products created this month in this category
          const monthlyProducts = await this.prisma.products.count({
            where: {
              categoryId: category.id,
              createdAt: {
                gte: startOfMonth,
              },
            },
          });

          let imageUrl = category.imageUrl;

          // Check if the imageUrl is an S3 key (not a full URL)
          if (
            imageUrl &&
            !imageUrl.startsWith('http') &&
            !imageUrl.startsWith('https')
          ) {
            try {
              imageUrl = await this.awsService.getSignedUrl(category.imageUrl);
            } catch (error) {
              console.error(
                `Error generating signed URL for category ${category.id}:`,
                error,
              );
              // Keep the original imageUrl if signed URL generation fails
            }
          }

          return {
            ...category,
            imageUrl,
            totalProducts,
            monthlyProducts,
          };
        }),
      );

      return {
        success: true,
        message: 'Categories retrieved successfully',
        data: categoriesWithCounts,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error fetching categories:', error);
      throw new BadRequestException('Failed to retrieve categories');
    }
  }

  async getAllTokenCategories() {
    try {
      const categories = await this.prisma.category.findMany({
        where: { categoryType: 'TOKEN' },
      });

      if (!categories || categories.length === 0) {
        throw new NotFoundException('No categories found');
      }

      // Get the current date and calculate the start of the month
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Get product counts for each category
      const categoriesWithCounts = await Promise.all(
        categories.map(async (category) => {
          // Get total products in this category
          const totalProducts = await this.prisma.products.count({
            where: { categoryId: category.id },
          });

          // Get products created this month in this category
          const monthlyProducts = await this.prisma.products.count({
            where: {
              categoryId: category.id,
              createdAt: {
                gte: startOfMonth,
              },
            },
          });

          let imageUrl = category.imageUrl;

          // Check if the imageUrl is an S3 key (not a full URL)
          if (
            imageUrl &&
            !imageUrl.startsWith('http') &&
            !imageUrl.startsWith('https')
          ) {
            try {
              imageUrl = await this.awsService.getSignedUrl(category.imageUrl);
            } catch (error) {
              console.error(
                `Error generating signed URL for category ${category.id}:`,
                error,
              );
              // Keep the original imageUrl if signed URL generation fails
            }
          }

          return {
            ...category,
            imageUrl,
            totalProducts,
            monthlyProducts,
          };
        }),
      );

      return {
        success: true,
        message: 'Categories retrieved successfully',
        data: categoriesWithCounts,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error fetching categories:', error);
      throw new BadRequestException('Failed to retrieve categories');
    }
  }
}
