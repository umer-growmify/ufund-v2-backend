import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { AwsService } from 'src/aws/aws.service';
import { Multer } from 'multer';

@Injectable()
export class CategoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly awsService: AwsService,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
    file?: Express.Multer.File,
  ) {
    let imageKey: string | undefined;
    let imageUrl: string | undefined;

    console.log('Creating category with data:', createCategoryDto);

    if (file) {
      const { key, url } = await this.awsService.uploadFile(
        file,
        createCategoryDto.name,
        'categories',
      );
      imageKey = key;
      imageUrl = url;
    }

    console.log('Image Key:', imageKey);

    try {
      const createCategory = await this.prisma.category.create({
        data: {
          name: createCategoryDto.name,
          imageUrl: imageKey,
          categoryType: createCategoryDto.categoryType,
        },
      });

      console.log('Category created:', createCategory);

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
        where: { categoryType: 'PRODUCT', block: false },
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
              imageUrl = await this.awsService.getSignedUrl(
                category.imageUrl as string,
              );
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
        where: { categoryType: 'TOKEN', block: false },
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
              imageUrl = await this.awsService.getSignedUrl(
                category.imageUrl as string,
              );
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

  async blockCategory(categoryId: string) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      if (category.block) {
        throw new BadRequestException('Category is already blocked');
      }

      const blockedCategory = await this.prisma.category.update({
        where: { id: categoryId },
        data: { block: true },
      });

      return {
        success: true,
        message: 'Category blocked successfully',
        data: blockedCategory,
      };
    } catch (error) {
      console.error('Error blocking category:', error);
      throw new BadRequestException('Failed to block category');
    }
  }

  async unblockCategory(categoryId: string) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }
      if (!category.block) {
        throw new BadRequestException('Category is not blocked');
      }

      const unblockedCategory = await this.prisma.category.update({
        where: { id: categoryId },
        data: { block: false },
      });
      return {
        success: true,
        message: 'Category unblocked successfully',
        data: unblockedCategory,
      };
    } catch (error) {
      console.error('Error unblocking category:', error);
      throw new BadRequestException('Failed to unblock category');
    }
  }

  // edit category by id
  async editCategory(id: string, data: UpdateCategoryDto, file?: any) {
    try {
      const category = await this.prisma.category.update({
        where: { id },
        data,
      });
      return {
        success: true,
        message: 'Category updated successfully',
        data: category,
      };
    } catch (error) {
      console.error('Error updating category:', error);
      throw new BadRequestException('Failed to update category');
    }
  }

  async deleteCategory(id: string) {
    try {
      const category = await this.prisma.category.delete({
        where: { id },
      });
      return {
        success: true,
        message: 'Category deleted successfully',
        data: category,
      };
    } catch (error) {
      console.error('Error deleting category:', error);
      throw new BadRequestException('Failed to delete category');
    }
  }

  async getAllCategories() {
    try {
      const categories = await this.prisma.category.findMany();

      if (!categories || categories.length === 0) {
        throw new NotFoundException('No categories found');
      }

      // Generate signed URLs for category images
      const categoriesWithImages = await Promise.all(
        categories.map(async (category) => {
          let imageUrl = category.imageUrl;

          // Check if the imageUrl is an S3 key (not a full URL)
          if (
            imageUrl &&
            !imageUrl.startsWith('http') &&
            !imageUrl.startsWith('https')
          ) {
            try {
              imageUrl = await this.awsService.getSignedUrl(
                category.imageUrl as string,
              );
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
          };
        }),
      );

      return {
        success: true,
        message: 'Categories retrieved successfully',
        data: categoriesWithImages,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error fetching categories:', error);
      throw new BadRequestException('Failed to retrieve categories');
    }
  }

  async getCategoryById(id: string) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      let imageUrl = category.imageUrl;

      // Check if the imageUrl is an S3 key (not a full URL)
      if (
        imageUrl &&
        !imageUrl.startsWith('http') &&
        !imageUrl.startsWith('https')
      ) {
        try {
          imageUrl = await this.awsService.getSignedUrl(
            category.imageUrl as string,
          );
        } catch (error) {
          console.error(
            `Error generating signed URL for category ${category.id}:`,
            error,
          );
          // Keep the original imageUrl if signed URL generation fails
        }
      }

      return {
        success: true,
        message: 'Category retrieved successfully',
        data: { ...category, imageUrl },
      };
    } catch (error) {
      console.error('Error fetching category:', error);
      throw new BadRequestException('Failed to retrieve category');
    }
  }
}
