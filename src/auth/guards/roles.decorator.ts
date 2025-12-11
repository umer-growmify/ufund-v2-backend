/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
// src/auth/guards/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { RoleType, AdminRoleType } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: (RoleType | AdminRoleType)[]) => 
  SetMetadata(ROLES_KEY, roles);
