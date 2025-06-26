import { NextFunction, Request, Response } from 'express';
import { RESTHandler, RESTMethods, RESTRoute } from '../../server';
import prisma from '../../lib/prisma';
import { z } from 'zod';

const schema = z.object({
  recipe: z.string().nonempty(),
});

const handler: RESTHandler = async (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const recipe = schema.parse(req.query).recipe;
  const r = await prisma.recipe.findFirst({
    where: { name: recipe, userId: req.user.id },
  });
  if (!r) {
    return res.status(404).json({ error: 'Cannot find recipe for user' });
  }
  await prisma.recipe.delete({
    where: {
      name: recipe,
      userId: req.user.id,
      id: r.id,
    },
  });
  res.status(204).json({ message: 'Recipe deleted successfully' });
};

export const DeleteUser = {
  method: RESTMethods.DELETE,
  path: '/cook',
  run: handler,
  needsAuth: true,
} as RESTRoute;
export default DeleteUser;
