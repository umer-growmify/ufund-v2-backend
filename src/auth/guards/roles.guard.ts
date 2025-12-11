/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleType, AdminRoleType } from '@prisma/client';
import { Request } from 'express';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    console.log('RolesGuard - Initialized');

    const requiredRoles = this.reflector.getAllAndOverride<(RoleType | AdminRoleType)[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log('RolesGuard - Required Roles:', requiredRoles);

    if (!requiredRoles || requiredRoles.length === 0) {
      console.log('RolesGuard - No roles required, allowing access');
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as any;

    console.log('RolesGuard - User:', user);

    if (!user) {
      console.log('RolesGuard - No user found in request');
      throw new UnauthorizedException('Not authenticated');
    }

    if (user.activeRole === AdminRoleType.SUPER_ADMIN) {
      console.log('RolesGuard - Super admin, granting access');
      return true;
    }

    if (!requiredRoles.includes(user.activeRole)) {
      console.log(`RolesGuard - User role ${user.activeRole} does not match required roles: ${requiredRoles.join(' or ')}`);
      throw new ForbiddenException(`Required role: ${requiredRoles.join(' or ')}`);
    }

    console.log('RolesGuard - Role check passed');
    return true;
  }
}