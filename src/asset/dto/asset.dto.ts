import { ApiProperty } from '@nestjs/swagger';
import { RiskScale } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateAssetDto {
  @ApiProperty({ example: 'Gold Investment Asset' })
  @IsString()
  @IsNotEmpty()
  assetName: string;

  @ApiProperty({ example: 'GoldToken' })
  @IsString()
  @IsNotEmpty()
  tokenName: string;

  @ApiProperty({ example: '1000000' })
  @IsString()
  @IsNotEmpty()
  tokenValue: string;

  @ApiProperty({ example: 'GLD' })
  @IsString()
  @IsNotEmpty()
  tokenSymbol: string;

  @ApiProperty({ example: '1000000' })
  @IsString()
  @IsNotEmpty()
  tokenSupply: string;

  @ApiProperty({ example: 18 })
  @IsInt()
  @IsNotEmpty()
  decimal: number;

  @ApiProperty({ example: 'KPMG Auditors' })
  @IsString()
  @IsNotEmpty()
  auditorsName: string;

  @ApiProperty({ example: 5 })
  @IsNumber()
  @Min(0)
  @Max(100)
  adminCommission: number;

  @ApiProperty({ example: 1000000 })
  @IsNumber()
  assetValue: number;

  @ApiProperty({ example: 'category-uuid-id' })
  @IsUUID()
  categoryId: string;

  @ApiProperty({ example: 'asset-type-uuid-id' })
  @IsUUID()
  assetTypeId: string;

  @ApiProperty({ example: 'token-type-uuid-id' })
  @IsUUID()
  tokenTypeId: string;

  @ApiProperty({ example: 'user-uuid-id', required: false })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({ example: 'creator-uuid-id', required: false })
  @IsOptional()
  @IsUUID()
  creatorId?: string;

  @ApiProperty({ example: 'Ethereum', required: false })
  @IsOptional()
  @IsString()
  network?: string;

  @ApiProperty({ example: 'ERC20Template', required: false })
  @IsOptional()
  @IsString()
  contractTemplate?: string;

  @ApiProperty({ example: '2025-08-01' })
  @IsDateString()
  offerStartDate: string;

  @ApiProperty({ example: '2025-09-01' })
  @IsDateString()
  offerEndDate: string;

  @ApiProperty({ example: '2025-12-01', required: false })
  @IsOptional()
  @IsDateString()
  rewardDate?: string;

  @ApiProperty({ example: 'Annual profit reward', required: false })
  @IsOptional()
  @IsString()
  reward?: string;

  @ApiProperty({ example: 'Description of the asset', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'MEDIUM', enum: RiskScale })
  @IsEnum(RiskScale)
  riskScale: RiskScale;
}
export class CreateAssetTypeDto {
  @ApiProperty({
    example: 'Write type of the asset',
    description: 'Name of the asset Type',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreateTokenTypeDto {
  @ApiProperty({
    example: 'Write type of the token',
    description: 'Name of the Token Type',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
