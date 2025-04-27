import { NextFunction, Request, Response } from 'express';
import prisma from '../../lib/prisma';
import { RESTHandler, RESTMethods, RESTRoute } from '../../server';
import { z } from 'zod';

const schema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
});

const handler: RESTHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { title } = schema.parse(req.body);

  const createdConversation = await prisma.aIConversation.create({
    data: {
      userId: req.user.id,
      title,
    },
  });

  return res.status(201).json({ conversation: createdConversation });
};

export const NewConversation: RESTRoute = {
  method: RESTMethods.POST,
  path: '/ai/conversation',
  run: handler,
  needsAuth: true,
  schema,
};

export default NewConversation;
