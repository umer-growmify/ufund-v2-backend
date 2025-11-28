import { RoleType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

enum UpdateUserStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export class UpdateUserStatusDto {
  @ApiProperty({
    example: 'APPROVED',
    description: 'New status of the user',
    enum: UpdateUserStatus,
  })
  @IsString()
  @IsNotEmpty()
  status: UpdateUserStatus;
}

export class RequestRoleDto {
  @IsEnum(RoleType)
  role: RoleType; // must be CAMPAIGNER

  @IsString()
  actingAs: 'INDIVIDUAL' | 'COMPANY';
}
