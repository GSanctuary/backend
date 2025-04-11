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

  res.json({ user }).status(201);
};

export const GetCredential = {
  path: '/user',
  method: RESTMethods.POST,
  run: handler,
} as RESTRoute;

export default GetCredential;
