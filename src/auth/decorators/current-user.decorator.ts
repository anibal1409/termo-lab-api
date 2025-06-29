import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

import { User } from '../../repositories/users/entities';

export const CurrentUser = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as User;

    return data ? user?.[data] : user;
  },
);
