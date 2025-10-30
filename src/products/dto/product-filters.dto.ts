import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsArray,
  IsString,
  IsNumber,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Status, RiskScale } from '@prisma/client';

export class ProductFiltersDto {
  @ApiPropertyOptional({ type: [String], description: 'Array of category IDs' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categoryIds?: string[];

  @ApiPropertyOptional({ description: 'Minimum price' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Maximum price' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxPrice?: number;

  @ApiPropertyOptional({ description: 'Offer start date from (ISO string)' })
  @IsOptional()
  @IsDateString()
  offerStartDateFrom?: string;

  @ApiPropertyOptional({ description: 'Offer start date to (ISO string)' })
  @IsOptional()
  @IsDateString()
  offerStartDateTo?: string;

  @ApiPropertyOptional({ description: 'Offer end date from (ISO string)' })
  @IsOptional()
  @IsDateString()
  offerEndDateFrom?: string;

  @ApiPropertyOptional({ description: 'Offer end date to (ISO string)' })
  @IsOptional()
  @IsDateString()
  offerEndDateTo?: string;

  @ApiPropertyOptional({ description: 'Maturity date from (ISO string)' })
  @IsOptional()
  @IsDateString()
  maturityDateFrom?: string;

  @ApiPropertyOptional({ description: 'Maturity date to (ISO string)' })
  @IsOptional()
  @IsDateString()
  maturityDateTo?: string;

  @ApiPropertyOptional({
    type: [String],
    description: 'Array of campaigner IDs',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  campaignerIds?: string[];

  @ApiPropertyOptional({ enum: Status, description: 'Product status' })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @ApiPropertyOptional({ enum: RiskScale, description: 'Risk scale' })
  @IsOptional()
  @IsEnum(RiskScale)
  riskScale?: RiskScale;
}

export class PaginationDto {
  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  skip?: number = 0;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  take?: number = 10;
}

export class GetFilteredProductsDto {
  @ApiProperty({ type: ProductFiltersDto })
  @Type(() => ProductFiltersDto)
  filters: ProductFiltersDto;

  @ApiProperty({ type: PaginationDto })
  @Type(() => PaginationDto)
  pagination?: PaginationDto;
}
