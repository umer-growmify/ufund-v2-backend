import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ example: 'PV Ltd', description: 'Name of the company' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'RADG5678244',
    description: 'Registration number',
    required: false,
  })
  @IsString()
  @IsOptional() // Use IsOptional if field is optional
  registrationNumber?: string;

  @ApiProperty({ example: 'London, UK', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: 'UK', required: false })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({
    type: Object,
    description: 'Documents in JSON format',
  })
  @IsOptional()
  documents?: Record<string, any>;

  @ApiProperty({ example: 'user-uuid', description: 'Owner User ID' })
  @IsString()
  @IsNotEmpty()
  ownerUserId: string;
}
