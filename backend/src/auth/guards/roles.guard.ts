import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'generated/prisma/enums';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.get<Role[]>(process.env.ROLES_KEY, context.getHandler());

        // If no roles specified, allow everyone (JwtAuthGuard handles auth)
        if (!requiredRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;  // From JwtAuthGuard

        // Check if user's role is in requiredRoles
        if (!requiredRoles.includes(user.role)) {
            throw new ForbiddenException('You do not have permission');
        }

        return true;
    }
}