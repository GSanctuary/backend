import { NextFunction, Request, Response } from 'express';
import { RESTHandler, RESTMethods, RESTRoute } from '../../server';
import prisma from '../../lib/prisma';

const handler: RESTHandler = async (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  await prisma.user.delete({
    where: {
      id: req.user!.id,
    },
  });
  res.status(204).json({ message: 'User deleted successfully' });
};

export const DeleteUser = {
  method: RESTMethods.DELETE,
  path: '/user',
  run: handler,
  needsAuth: true,
} as RESTRoute;
export default DeleteUser;
