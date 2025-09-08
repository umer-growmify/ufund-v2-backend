import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    try {
      const createCategory = await this.prisma.category.create({
        data: {
          name: createCategoryDto.name,
          imageUrl:
            createCategoryDto.imageUrl ||
            'https://example.com/default-category-image.png',
          categoryType: createCategoryDto.categoryType,
        },
      });

      return {
        success: true,
        message: 'Category created successfully',
        data: createCategory,
      };
    } catch (error) {
      throw new NotFoundException('Category creation failed');
    }
  }

  async getAllCategories() {
    try {
      const categories = await this.prisma.category.findMany();
      return {
        success: true,
        message: 'Categories retrieved successfully',
        data: categories,
      };
    } catch (error) {
      throw new NotFoundException('No categories found');
    }
  }

  async getProductCategory() {
    try {
      const categories = await this.prisma.category.findMany({
        where: { categoryType: 'PRODUCT' },
      });
      return {
        success: true,
        message: 'Categories retrieved successfully',
        data: categories,
      };
    } catch (error) {
      throw new NotFoundException('No categories found');
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

      return {
        success: true,
        message: 'Category retrieved successfully',
        data: category,
      };
    } catch (error) {
      throw new NotFoundException('Category retrieval failed');
    }
  }
}
