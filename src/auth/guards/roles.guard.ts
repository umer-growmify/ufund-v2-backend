// src/auth/guards/roles.guard.ts
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleType, AdminRoleType } from '@prisma/client';
import { Request } from 'express';

type AnyRole = RoleType | AdminRoleType;

export const ROLES_KEY = 'roles';
export const Roles = (...roles: AnyRole[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<AnyRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // No roles required = public endpoint
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    console.log(`Required roles: ${requiredRoles.join(', ')}`);
    

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as any;

    // No user = not authenticated
    if (!user) {
      throw new UnauthorizedException('Not authenticated');
    }

    // SUPER_ADMIN has full access
    if (user.activeRole === 'SUPER_ADMIN') {
      return true;
    }

    // Check if user has required role
    if (!requiredRoles.includes(user.activeRole)) {
      console.log(`User role: ${user.activeRole}`);
      throw new ForbiddenException(
        `Required role: ${requiredRoles.join(' or ')}`
      );
    }

    return true;
  }
}