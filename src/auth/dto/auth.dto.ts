import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
  IsArray,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoleType } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: '+923001234567' })
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ example: '+92' })
  @IsNotEmpty()
  @IsString()
  countryCode: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  repeatPassword: string;

  @ApiProperty({ example: true })
  @IsNotEmpty()
  @IsBoolean()
  agreedToTerms: boolean;

  @ApiProperty({ example: ['investor'], isArray: true, enum: RoleType })
  @IsNotEmpty()
  @IsArray()
  @IsEnum(RoleType, { each: true })
  roles: RoleType[];
}

export class LoginDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  rememberMe?: boolean;

  @ApiProperty({ example: 'investor', enum: RoleType })
  @IsNotEmpty()
  @IsEnum(RoleType)
  activeRole: RoleType;
}

export class AdminLoginDto {
  @ApiProperty({ example: 'admin@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'adminpassword' })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class SocialUserDto {
  @ApiProperty({ example: 'google' })
  @IsNotEmpty()
  provider: string;

  @ApiProperty({ example: 'google-123456' })
  @IsNotEmpty()
  providerId: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: 'John' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: 'investor', enum: RoleType })
  @IsNotEmpty()
  @IsEnum(RoleType)
  activeRole: RoleType;
}

export class UpdateProfileUserDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsOptional()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiPropertyOptional({ example: '+1234567890' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({ example: '+1' })
  @IsOptional()
  @IsString()
  countryCode?: string;
}
