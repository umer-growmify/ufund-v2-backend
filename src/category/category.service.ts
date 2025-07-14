import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    const createCategory = await this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
        imageUrl: createCategoryDto.imageUrl || 'https://example.com/default-category-image.png',
        categoryType: createCategoryDto.categoryType,
      },
    });

    return {
        success: true,
        message: 'Category created successfully',
        data: createCategory,
    }
  }
}
