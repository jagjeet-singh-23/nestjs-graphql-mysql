import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as jwt from 'jsonwebtoken';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;

    if (req.user) return req.user;

    const authHeader = req.headers.authorization;
    if (!authHeader) return null;

    const token = authHeader.split(' ')[1];
    if (!token) return null;

    try {
      const decoded = jwt.verify(token, 'my_secret_key');
      return {
        userId: decoded.sub,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  },
);
