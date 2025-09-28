import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

enum RiskScale {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

enum UpdateStatus {
  LIVE = 'LIVE',
  REJECTED = 'REJECTED',
}
export class CreateProductDto {
  @ApiProperty({ example: 'iPhone 15 Pro', description: 'Product name' })
  @IsString()
  @IsNotEmpty()
  productName: string;

  @ApiProperty({ example: 'Apple', description: 'Brand name' })
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiProperty({ example: '100', description: 'Number of product units' })
  @IsString()
  @IsNotEmpty()
  numberOfProducts: string;

  @ApiProperty({ example: '8517.12.00', description: 'HS Code of product' })
  @IsString()
  @IsNotEmpty()
  hsCode: string;

  @ApiProperty({ example: '1234567890123', description: 'EAN code' })
  @IsString()
  @IsNotEmpty()
  eanCode: string;

  @ApiProperty({ example: '012345678905', description: 'UPC code' })
  @IsString()
  @IsNotEmpty()
  upcCode: string;

  @ApiProperty({ example: 'uuid-of-category', description: 'Category ID' })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ example: '1000000', description: 'Total product value' })
  @IsString()
  @IsNotEmpty()
  totalValue: string;

  @ApiProperty({
    example: 15,
    description: 'Investment profit percentage (0-100)',
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  investmentProfit: number;

  @ApiProperty({
    example: 5,
    description: 'Admin commission percentage (0-100)',
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  adminCommission: number;

  @ApiProperty({ example: '1000', description: 'Price per unit' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  unitPrice: string;

  @ApiProperty({ example: 100000, description: 'Total value of all products' })
  @IsNumber()
  @IsOptional()
  productTotalValue: number;

  @ApiPropertyOptional({
    example: 'uuid-of-campaigner',
    description: 'Optional campaigner ID',
  })
  @IsOptional()
  @IsString()
  campaignerId?: string;

  @ApiPropertyOptional({
    example: 'uuid-of-creator',
    description: 'Optional user ID who created it',
  })
  @IsOptional()
  @IsString()
  creatorId?: string;

  @ApiProperty({
    example: 'Latest high-end smartphone from Apple',
    description: 'Description of the product',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 'MEDIUM',
    enum: RiskScale,
    description: 'Risk scale classification',
  })
  @IsEnum(RiskScale)
  @IsNotEmpty()
  riskScale: RiskScale;

  @ApiProperty({
    example: '2025-08-01',
    description: 'Offer start date in YYYY-MM-DD format',
  })
  @IsDateString()
  @IsNotEmpty()
  offerStartDate: string;

  @ApiProperty({
    example: '2025-09-01',
    description: 'Offer end date in YYYY-MM-DD format',
  })
  @IsDateString()
  @IsNotEmpty()
  offerEndDate: string;

  @ApiProperty({ example: '2025-08-02', description: 'Investment start date' })
  @IsDateString()
  @IsNotEmpty()
  investmentStartDate: string;

  @ApiProperty({ example: 90, description: 'Number of days until maturity' })
  @IsNumber()
  @IsNotEmpty()
  maturityCountDays: number;

  @ApiProperty({
    example: '2025-12-01',
    description: 'Date when investment matures',
  })
  @IsDateString()
  @IsNotEmpty()
  maturityDate: string;
}

export class UpdateProductStatusDto {
  @ApiProperty({ example: 'live', description: 'New status of the product' })
  @IsString()
  @IsNotEmpty()
  status: UpdateStatus;
}

export class EditProductDto {
  @ApiProperty({ example: 'iPhone 15 Pro', description: 'Product name' })
  @IsString()
  @IsOptional()
  productName: string;

  @ApiProperty({ example: 'Apple', description: 'Brand name' })
  @IsString()
  @IsOptional()
  brand: string;

  @ApiProperty({ example: '100', description: 'Number of product units' })
  @IsString()
  @IsOptional()
  numberOfProducts: string;

  @ApiProperty({ example: '8517.12.00', description: 'HS Code of product' })
  @IsString()
  @IsOptional()
  hsCode: string;

  @ApiProperty({ example: '1234567890123', description: 'EAN code' })
  @IsString()
  @IsOptional()
  eanCode: string;

  @ApiProperty({ example: '012345678905', description: 'UPC code' })
  @IsString()
  @IsOptional()
  upcCode: string;

  @ApiProperty({ example: 'uuid-of-category', description: 'Category ID' })
  @IsString()
  @IsOptional()
  categoryId: string;

  @ApiProperty({ example: '1000000', description: 'Total product value' })
  @IsString()
  @IsOptional()
  totalValue: string;

  @ApiProperty({
    example: 15,
    description: 'Investment profit percentage (0-100)',
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  investmentProfit: number;

  @ApiProperty({
    example: 5,
    description: 'Admin commission percentage (0-100)',
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  adminCommission: number;

  @ApiProperty({ example: '1000', description: 'Price per unit' })
  @IsString()
  @IsOptional()
  unitPrice: string;

  @ApiProperty({ example: 100000, description: 'Total value of all products' })
  @IsOptional()
  @IsString()
  productTotalValue: String;

  @ApiPropertyOptional({
    example: 'uuid-of-campaigner',
    description: 'Optional campaigner ID',
  })
  @IsOptional()
  @IsString()
  campaignerId?: string;

  @ApiPropertyOptional({
    example: 'uuid-of-creator',
    description: 'Optional user ID who created it',
  })
  @IsOptional()
  @IsString()
  creatorId?: string;

  @ApiProperty({
    example: 'Latest high-end smartphone from Apple',
    description: 'Description of the product',
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    example: 'MEDIUM',
    enum: RiskScale,
    description: 'Risk scale classification',
  })
  @IsEnum(RiskScale)
  @IsOptional()
  riskScale: RiskScale;

  @ApiProperty({
    example: '2025-08-01',
    description: 'Offer start date in YYYY-MM-DD format',
  })
  @IsDateString()
  @IsOptional()
  offerStartDate: string;

  @ApiProperty({
    example: '2025-09-01',
    description: 'Offer end date in YYYY-MM-DD format',
  })
  @IsDateString()
  @IsOptional()
  offerEndDate: string;

  @ApiProperty({ example: '2025-08-02', description: 'Investment start date' })
  @IsDateString()
  @IsOptional()
  investmentStartDate: string;

  @ApiProperty({ example: 90, description: 'Number of days until maturity' })
  @IsNumber()
  @IsOptional()
  maturityCountDays: number;

  @ApiProperty({
    example: '2025-12-01',
    description: 'Date when investment matures',
  })
  @IsDateString()
  @IsOptional()
  maturityDate: string;
}
