import { IsEmail, IsEnum, IsNotEmpty, IsString, IsArray } from 'class-validator';
import { AdminRoleType } from '@prisma/client';

export class CreateAdminDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(AdminRoleType) // Validate single enum value
  role: AdminRoleType;   // Change to singular
}


export class AdminLoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}