import { randomUUID } from 'crypto';
import { RESTRoute, RESTMethods, RESTHandler } from '../../server';
import prisma from '../../lib/prisma';
import { NextFunction, Request, Response } from 'express';

const handler: RESTHandler = async (
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const randomUuid = randomUUID();

  const user = await prisma.user.create({
    data: {
      apiKey: randomUuid,
    },
  });

  return res.status(201).json({ user });
};

export const GetCredential = {
  path: '/user/credential',
  method: RESTMethods.POST,
  run: handler,
} as RESTRoute;

export default GetCredential;
