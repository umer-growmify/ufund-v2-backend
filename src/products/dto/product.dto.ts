import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

enum RiskScale {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
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

  @ApiProperty({ example: 100, description: 'Number of product units' })
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
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ example: 1000000, description: 'Total product value' })
  @IsString()
  @IsNotEmpty()
  totalValue: string;

  @ApiProperty({ example: 15, description: 'Investment profit percentage (0-100)' })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsNotEmpty() 
  investmentProfit: number;

  @ApiProperty({ example: 5, description: 'Admin commission percentage (0-100)' })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsNotEmpty()
  adminCommission: number;

  @ApiProperty({ example: 1000, description: 'Price per unit' })
  @IsNumber()
  @IsNotEmpty()
  unitPrice: number;

  @ApiProperty({ example: 100000, description: 'Total value of all products (unitPrice * numberOfProducts)' })
  @IsNumber()
  @IsNotEmpty()
  productTotalValue: number;

  @ApiPropertyOptional({ example: 'uuid-of-campaigner', description: 'Optional campaigner ID' })
  @IsOptional()
  @IsUUID()
  campaignerId?: string;

  @ApiPropertyOptional({ example: 'uuid-of-creator', description: 'Optional user ID who created it' })
  @IsOptional()
  @IsUUID()
  creatorId?: string;

  @ApiProperty({ example: 'Latest high-end smartphone from Apple', description: 'Description of the product' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'MEDIUM', enum: RiskScale, description: 'Risk scale classification' })
  @IsEnum(RiskScale)
  @IsNotEmpty()
  riskScale: RiskScale;

  @ApiProperty({ example: '2025-08-01', description: 'Offer start date in YYYY-MM-DD format' })
  @IsDateString()
  @IsNotEmpty()
  offerStartDate: string;

  @ApiProperty({ example: '2025-09-01', description: 'Offer end date in YYYY-MM-DD format' })
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

  @ApiProperty({ example: '2025-12-01', description: 'Date when investment matures' })
  @IsDateString()
  @IsNotEmpty()
  maturityDate: string;
}
export class UpdateProductDto {}  // You can add similar properties here if needed
