import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsNumber,
  IsOptional,
  IsEnum,
  IsDateString,
  IsUrl,
  Min,
  Max,
  IsInt,
} from 'class-validator';
import { RiskScale } from '@prisma/client';

export class CreateAssetDto {
  @ApiProperty({
    example: 'Gold Investment Asset',
    description: 'Name of the asset',
  })
  @IsString()
  @IsNotEmpty()
  assetName: string;

  @ApiProperty({
    example: 'GoldToken',
    description: 'Name of the token associated with asset',
  })
  @IsString()
  @IsNotEmpty()
  tokenName: string;

  @ApiProperty({
    example: '1000000',
    description: 'Total token value in numbers as string',
  })
  @IsString()
  @IsNotEmpty()
  tokenValue: string;

  @ApiProperty({ example: 'GLD', description: 'Token symbol' })
  @IsString()
  @IsNotEmpty()
  tokenSymbol: string;

  @ApiProperty({
    example: '1000000',
    description: 'Total token supply in numbers as string',
  })
  @IsString()
  @IsNotEmpty()
  tokenSupply: string;

  @ApiProperty({ example: 18, description: 'Decimal precision for token' })
  @IsInt()
  @IsNotEmpty()
  decimal: number;

  @ApiProperty({
    example: 'KPMG Auditors',
    description: 'Name of the auditing company',
  })
  @IsString()
  @IsNotEmpty()
  auditorsName: string;

  @ApiProperty({ example: 5, description: 'Admin commission in percentage' })
  @IsNumber()
  @Min(0)
  @Max(100)
  adminCommission: number;

  @ApiProperty({
    example: 1000000,
    description: 'Total asset value in numbers',
  })
  @IsNumber()
  assetValue: number;

  @ApiProperty({
    example: 'category-uuid-id',
    description: 'UUID of the category',
  })
  @IsUUID()
  categoryId: string;

  @ApiProperty({
    example: 'asset-type-uuid-id',
    description: 'UUID of the asset type',
  })
  @IsUUID()
  assetTypeId: string;

  @ApiProperty({
    example: 'token-type-uuid-id',
    description: 'UUID of the token type',
  })
  @IsUUID()
  tokenTypeId: string;

  @ApiProperty({
    example: '2025-08-01',
    description: 'Offer start date in YYYY-MM-DD format',
  })
  @IsDateString()
  offerStartDate: string;

  @ApiProperty({
    example: '2025-09-01',
    description: 'Offer end date in YYYY-MM-DD format',
  })
  @IsDateString()
  offerEndDate: string;

  @ApiProperty({
    example: '2025-12-01',
    description: 'Reward date (optional)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  rewardDate?: string;

  @ApiProperty({
    example: 'Annual profit reward',
    description: 'Description of reward (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  rewardDescription?: string;

  @ApiProperty({
    example: 'MEDIUM',
    enum: RiskScale,
    description: 'Risk scale classification',
  })
  @IsEnum(RiskScale)
  riskScale: RiskScale;

  @ApiProperty({
    example: 'https://example.com/audit-report.pdf',
    description: 'URL for auditors report',
  })
  @IsUrl()
  auditorsReportUrl: string;

  @ApiProperty({
    example: 'https://example.com/token-image.png',
    description: 'Token image URL',
  })
  @IsUrl()
  tokenImageUrl: string;

  @ApiProperty({
    example: 'https://example.com/asset-image.png',
    description: 'Asset image URL',
  })
  @IsUrl()
  assetImageUrl: string;
}
