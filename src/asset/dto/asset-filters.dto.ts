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

export class AssetFiltersDto {
  @ApiPropertyOptional({ type: [String], description: 'Array of category IDs' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categoryIds?: string[];

  @ApiPropertyOptional({
    type: [String],
    description: 'Array of asset type IDs',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  assetTypeIds?: string[];

  @ApiPropertyOptional({
    type: [String],
    description: 'Array of token type IDs',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tokenTypeIds?: string[];

  @ApiPropertyOptional({ type: [String], description: 'Array of creator IDs' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  creatorIds?: string[];

  @ApiPropertyOptional({ description: 'Minimum asset value' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minAssetValue?: number;

  @ApiPropertyOptional({ description: 'Maximum asset value' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxAssetValue?: number;

  @ApiPropertyOptional({ description: 'Minimum token value' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minTokenValue?: number;

  @ApiPropertyOptional({ description: 'Maximum token value' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxTokenValue?: number;

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

  @ApiPropertyOptional({ description: 'Reward date from (ISO string)' })
  @IsOptional()
  @IsDateString()
  rewardDateFrom?: string;

  @ApiPropertyOptional({ description: 'Reward date to (ISO string)' })
  @IsOptional()
  @IsDateString()
  rewardDateTo?: string;

  @ApiPropertyOptional({ enum: Status, description: 'Asset status' })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @ApiPropertyOptional({ enum: RiskScale, description: 'Risk scale' })
  @IsOptional()
  @IsEnum(RiskScale)
  riskScale?: RiskScale;

  @ApiPropertyOptional({ description: 'Network filter' })
  @IsOptional()
  @IsString()
  network?: string;
}

export class AssetPaginationDto {
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

export class GetFilteredAssetsDto {
  @ApiProperty({ type: AssetFiltersDto })
  @Type(() => AssetFiltersDto)
  filters: AssetFiltersDto;

  @ApiProperty({ type: AssetPaginationDto })
  @Type(() => AssetPaginationDto)
  pagination?: AssetPaginationDto;
}
