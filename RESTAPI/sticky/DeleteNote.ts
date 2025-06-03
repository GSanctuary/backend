import { z } from 'zod';
import { RESTHandler, RESTMethods, RESTRoute } from '../../server';
import prisma from '../../lib/prisma';

const schema = z.object({
  id: z.number().int().positive('Note ID must be a positive integer'),
});

const handler: RESTHandler = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Implement logic here
  const { id } = schema.parse(req.query);
  const note = await prisma.stickyNote.delete({
    where: {
      id,
      userId: req.user.id,
    },
    select: {
      id: true,
      content: true,
      metadata: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!note) {
    return res.status(404).json({ error: 'Note not found' });
  }
  return res.status(200).json({ note });
};

const DeleteNote: RESTRoute = {
  method: RESTMethods.DELETE,
  needsAuth: true,
  path: '/sticky/',
  run: handler,
};

export default DeleteNote;
