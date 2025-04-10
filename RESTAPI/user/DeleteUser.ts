import { NextFunction, Request, Response } from 'express';
import { RESTHandler, RESTMethods, RESTRoute } from '../../server';
import prisma from '../../lib/prisma';

const handler: RESTHandler = async (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const apiKey = req.headers['x-api-key'] as string;

  if (!apiKey) {
    return res.status(400).json({ error: 'No API key provided' });
  }
  const user = await prisma.user.findUnique({
    where: {
      apiKey,
    },
  });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  await prisma.user.delete({
    where: {
      apiKey,
    },
  });
  res.status(204).json({ message: 'User deleted successfully' });
};

export const DeleteUser = {
  method: RESTMethods.DELETE,
  path: '/user',
  run: handler,
} as RESTRoute;
export default DeleteUser;
