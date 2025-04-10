import { randomUUID } from 'crypto';
import { RESTHandler, RESTMethods } from '../../server';
import prisma from '../../lib/prisma';
import { NextFunction, Request, Response } from 'express';

const handler = async (_req: Request, res: Response, next: NextFunction) => {
  const randomUuid = randomUUID();

  const user = await prisma.user.create({
    data: {
      apiKey: randomUuid,
    },
  });

  res.json({ user });
};

export const GetCredential = {
  path: '/user',
  method: RESTMethods.GET,
  run: handler,
} as RESTHandler;

export default GetCredential;
