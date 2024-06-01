import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { JsonWebToken } from '../domain/json-web-token';

export const CurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JsonWebToken;
    return user.sub;
  },
);
