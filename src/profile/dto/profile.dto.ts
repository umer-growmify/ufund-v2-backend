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

export class CreateProfileDto {
  @IsEnum(UserAccountType)
  @IsNotEmpty()
  userAccountType: UserAccountType;

  @IsEnum(IncomeFrequencyType)
  @IsNotEmpty()
  incomeFrequency: IncomeFrequencyType;

  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  totalAnnualRevenue?: number;

  // Personal Address
  @IsString()
  @IsNotEmpty()
  addressLine1: string;

  @IsString()
  @IsOptional()
  addressLine2?: string;

  @IsString()
  @IsNotEmpty()
  zipCode: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  // Company Information
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsEmail()
  @IsNotEmpty()
  companyEmail: string;

  @IsString()
  @IsNotEmpty()
  companyTelephone: string;

  @IsString()
  @IsNotEmpty()
  companyAddress: string;

  // Banking Information
  @IsString()
  @IsNotEmpty()
  bankName: string;

  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @IsString()
  @IsNotEmpty()
  accountName: string;

  @IsString()
  @IsNotEmpty()
  routingNumber: string;

  @IsString()
  @IsNotEmpty()
  ibanNumber: string;

  @IsString()
  @IsNotEmpty()
  swiftNumber: string;

  @IsEnum(BankAccountType)
  bankAccountType: BankAccountType;

  @IsString()
  @IsNotEmpty()
  bankAddress: string;
}
