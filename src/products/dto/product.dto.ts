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

enum RiskScale {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsString()
   @IsNotEmpty()
  brand: string;

  @IsNumber()
   @IsNotEmpty()
  numberOfProducts: number;

  @IsString()
  hsCode: string;

  @IsString()
  eanCode: string;

  @IsString()
  upcCode: string;

  @IsUUID()
  categoryId: string;

  @IsNumber()
  totalValue: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  investmentProfit: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  adminCommission: number;

  @IsNumber()
  unitPrice: number;

  @IsNumber()
  productTotalValue: number;

  @IsOptional()
  @IsUUID()
  campaignerId?: string;

  @IsString()
  description: string;

  @IsEnum(RiskScale)
  riskScale: RiskScale;

  @IsDateString()
  offerStartDate: string;

  @IsDateString()
  offerEndDate: string;

  @IsDateString()
  investmentStartDate: string;

  @IsNumber()
  maturityCountDays: number;

  @IsDateString()
  maturityDate: string;

  @IsUrl()
  auditorsReportUrl: string;

  @IsUrl()
  tokenImageUrl: string;

  @IsUrl()
  assetImageUrl: string;
}

export class UpdateProductDto {}
