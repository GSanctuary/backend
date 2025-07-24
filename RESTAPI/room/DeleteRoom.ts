import { NextFunction, Request, Response } from 'express';
import { RESTHandler, RESTMethods, RESTRoute } from '../../server';
import prisma from '../../lib/prisma';
import { z } from 'zod';

const schema = z.object({
  anchorId: z.string().nonempty(),
});

const handler: RESTHandler = async (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const anchorId = schema.parse(req.query).anchorId;
  const r = await prisma.room.findFirst({
    where: { anchorId, userId: req.user.id },
  });
  if (!r) {
    return res.status(404).json({ error: 'Cannot find room for user' });
  }
  await prisma.recipe.delete({
    where: {
      userId: req.user.id,
      id: r.id,
    },
  });
  res.status(204).json({ message: 'Room deleted successfully' });
};

export const DeleteRoom = {
  method: RESTMethods.DELETE,
  path: '/rooms',
  run: handler,
  needsAuth: true,
} as RESTRoute;
export default DeleteRoom;
