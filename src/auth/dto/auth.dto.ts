import {
    IsBoolean,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsPhoneNumber,
    IsString,
    MinLength
} from 'class-validator';

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
  @IsEnum(Role)
  role: Role;
}

export class LoginDto{
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  // here is remember me 
  @IsBoolean()
  rememberMe?: boolean;
}
