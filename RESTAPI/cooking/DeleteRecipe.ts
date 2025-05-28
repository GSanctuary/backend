import { NextFunction, Request, Response } from 'express';
import { RESTHandler, RESTMethods, RESTRoute } from '../../server';
import prisma from '../../lib/prisma';

const handler: RESTHandler = async (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (!req.query.recipe || typeof req.query.recipe !== 'string') {
    return res.status(400).json({ error: '"recipe" field missing or invalid' });
  }
  const r = await prisma.recipe.findFirst({
    where: { name: req.query.recipe, userId: req.user.id },
  });
  if (!r) {
    return res.status(404).json({ error: 'Cannot find recipe for user' });
  }
  await prisma.recipe.delete({
    where: {
      name: req.query.recipe,
      userId: req.user.id,
      id: r.id,
    },
  });
  res.status(204).json({ message: 'User deleted successfully' });
};

export const DeleteUser = {
  method: RESTMethods.DELETE,
  path: '/cook',
  run: handler,
  needsAuth: true,
} as RESTRoute;
export default DeleteUser;
