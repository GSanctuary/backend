import { NextFunction, Request, Response } from 'express';
import prisma from '../../lib/prisma';
import { RESTHandler, RESTMethods, RESTRoute } from '../../server';

const handler: RESTHandler = async (
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const users = await prisma.user.findMany();
  res.json({ users });
};

export const AllUsers: RESTRoute = {
  method: RESTMethods.GET,
  path: '/user/all',
  run: handler,
};

export default AllUsers;
