import { CategoryType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Electronics', description: 'Name of the category' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: 'https://example.com/category-image.jpg',
    description: 'Optional category image URL',
  })
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    example: 'PRODUCT',
    enum: CategoryType,
    description: 'Category type (e.g., PRODUCT, SERVICE, etc.)',
  })
  @IsEnum(CategoryType)
  categoryType: CategoryType;
}
