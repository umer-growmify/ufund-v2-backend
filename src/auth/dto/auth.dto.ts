import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MinLength, IsArray } from 'class-validator';

enum Role {
  investor = 'investor',
  campaigner = 'campaigner',
}

export class RegisterDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  countryCode: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  repeatPassword: string;

  @IsNotEmpty()
  @IsBoolean()
  agreedToTerms: boolean;

  @IsNotEmpty()
  @IsArray()
  @IsEnum(Role, { each: true })
  roles: Role[];  // Changed to array of roles
}

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsBoolean()
  rememberMe?: boolean;

  @IsNotEmpty()
  @IsEnum(Role)
  activeRole: Role;  // Added activeRole for role switching
}

export class SocialUserDto {
  @IsNotEmpty()
  provider: string;
  
  @IsNotEmpty()
  providerId: string;
  
  @IsNotEmpty()
  @IsEmail()
  email: string;
  
  @IsOptional()
  @IsString()
  firstName?: string;
  
  @IsOptional()
  @IsString()
  lastName?: string;
  
  @IsNotEmpty()
  @IsEnum(Role)
  activeRole: Role;  // Added activeRole for social login
}