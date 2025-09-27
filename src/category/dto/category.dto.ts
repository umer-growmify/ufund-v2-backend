import { CategoryType } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Electronics', description: 'Name of the category' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'PRODUCT',
    enum: CategoryType,
    description: 'Category type (e.g., PRODUCT, SERVICE, etc.)',
  })
  @IsEnum(CategoryType)
  categoryType: CategoryType;

  @ApiPropertyOptional({
    example: 'false',
    description: 'Block status of the category',
  })
  @IsUrl()
  @IsOptional()
  block?: boolean;
}

export class UpdateCategoryDto {
  @ApiProperty({ example: 'Electronics', description: 'Name of the category' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    example: 'PRODUCT',
    enum: CategoryType,
    description: 'Category type (e.g., PRODUCT, SERVICE, etc.)',
  })
  @IsEnum(CategoryType)
  @IsOptional()
  categoryType: CategoryType;

  @ApiPropertyOptional({
    example: 'false',
    description: 'Block status of the category',
  })
  @IsUrl()
  @IsOptional()
  block?: boolean;
}
