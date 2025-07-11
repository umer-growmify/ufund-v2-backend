import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { Request } from 'express';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are specified, allow all authenticated users
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as { id: string; roles: Role[]; activeRole: Role };

    // If user doesn't have activeRole, deny access
    if (!user?.activeRole) {
      throw new ForbiddenException('No active role assigned');
    }

    // Check if user's active role is in the required roles
    const hasRequiredRole = requiredRoles.includes(user.activeRole);

    if (!hasRequiredRole) {
      throw new ForbiddenException(
        `You need one of these roles: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}