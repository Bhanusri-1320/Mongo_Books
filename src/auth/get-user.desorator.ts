import { createParamDecorator } from '@nestjs/common';
import { User } from './schemas/user.schema';

export const GetUser = createParamDecorator((data, ctx):User => {
  const req = ctx.switchToHttp().getRequest();
  return req.user;
});
