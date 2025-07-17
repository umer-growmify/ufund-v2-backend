import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsEmail,
  IsUUID,
  IsNumber,
} from 'class-validator';
import {
  UserAccountType,
  IncomeFrequencyType,
  BankAccountType,
} from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProfileDto {
  @ApiProperty({
    example: 'INDIVIDUAL',
    enum: UserAccountType,
    description: 'User account type (INDIVIDUAL, COMPANY)',
  })
  @IsEnum(UserAccountType)
  @IsNotEmpty()
  userAccountType: UserAccountType;

  @ApiProperty({
    example: 'MONTHLY',
    enum: IncomeFrequencyType,
    description: 'Income frequency type (MONTHLY, YEARLY, etc.)',
  })
  @IsEnum(IncomeFrequencyType)
  @IsNotEmpty()
  incomeFrequency: IncomeFrequencyType;

  @ApiPropertyOptional({
    example: 50000,
    description: 'Optional total annual revenue',
  })
  @IsNumber()
  @IsOptional()
  totalAnnualRevenue?: number;

  // Personal Address
  @ApiProperty({ example: '123 Main Street', description: 'Address Line 1' })
  @IsString()
  @IsNotEmpty()
  addressLine1: string;

  @ApiPropertyOptional({
    example: 'Apartment 4B',
    description: 'Optional Address Line 2',
  })
  @IsString()
  @IsOptional()
  addressLine2?: string;

  @ApiProperty({ example: '12345', description: 'ZIP or postal code' })
  @IsString()
  @IsNotEmpty()
  zipCode: string;

  @ApiProperty({ example: 'New York', description: 'City name' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'NY', description: 'State or province name' })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ example: 'USA', description: 'Country name' })
  @IsString()
  @IsNotEmpty()
  country: string;

  // Company Information
  @ApiProperty({ example: 'Tech Solutions Ltd.', description: 'Company name' })
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty({
    example: 'contact@company.com',
    description: 'Company email address',
  })
  @IsEmail()
  @IsNotEmpty()
  companyEmail: string;

  @ApiProperty({
    example: '+1-555-1234567',
    description: 'Company telephone number',
  })
  @IsString()
  @IsNotEmpty()
  companyTelephone: string;

  @ApiProperty({
    example: '456 Corporate Blvd, Suite 100',
    description: 'Company address',
  })
  @IsString()
  @IsNotEmpty()
  companyAddress: string;

  // Banking Information
  @ApiProperty({ example: 'Bank of America', description: 'Bank name' })
  @IsString()
  @IsNotEmpty()
  bankName: string;

  @ApiProperty({ example: '1234567890', description: 'Bank account number' })
  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @ApiProperty({ example: 'John Doe', description: 'Bank account holder name' })
  @IsString()
  @IsNotEmpty()
  accountName: string;

  @ApiProperty({ example: '987654321', description: 'Routing number' })
  @IsString()
  @IsNotEmpty()
  routingNumber: string;

  @ApiProperty({
    example: 'PK12SCBL0000001123456702',
    description: 'IBAN number',
  })
  @IsString()
  @IsNotEmpty()
  ibanNumber: string;

  @ApiProperty({ example: 'SCBLUS33XXX', description: 'SWIFT/BIC code' })
  @IsString()
  @IsNotEmpty()
  swiftNumber: string;

  @ApiProperty({
    example: 'SAVINGS',
    enum: BankAccountType,
    description: 'Type of bank account (SAVINGS, CURRENT, etc.)',
  })
  @IsEnum(BankAccountType)
  bankAccountType: BankAccountType;

  @ApiProperty({
    example: '789 Bank Street, New York, NY',
    description: 'Bank branch address',
  })
  @IsString()
  @IsNotEmpty()
  bankAddress: string;
}
