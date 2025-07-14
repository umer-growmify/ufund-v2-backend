
import { CategoryType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
 
export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;
 
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @IsEnum(CategoryType)
  categoryType: CategoryType;
}