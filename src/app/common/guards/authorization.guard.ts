import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { JsonWebToken } from '../domain/json-web-token';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const requiredRole = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);

    const userRole = request.user.role as JsonWebToken;
    if (requiredRole !== userRole) {
      throw new HttpException(
        'Unauthorized! Only Admin can access this resource',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return true;
  }
}
