import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AdminRoleType } from '@prisma/client';

export class CreateAdminDto {
  @ApiProperty({ example: 'Hammad Abbas' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'admin@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'adminPassword123' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'SUPER_ADMIN',
    enum: AdminRoleType,
    description: 'Admin role type',
  })
  @IsEnum(AdminRoleType)
  role: AdminRoleType;
}

export class AdminLoginDto {
  @ApiProperty({ example: 'admin@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'adminPassword123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
 