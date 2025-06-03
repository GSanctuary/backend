import { z } from 'zod';
import { RESTHandler, RESTMethods, RESTRoute } from '../../server';
import prisma from '../../lib/prisma';

const schema = z.object({
  noteId: z.number().int().positive('Note ID must be a positive integer'),
});

const handler: RESTHandler = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Implement logic here
  const { noteId } = schema.parse(req.query);
  const note = await prisma.stickyNote.findUnique({
    where: {
      id: noteId,
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

const GetNote: RESTRoute = {
  method: RESTMethods.GET,
  needsAuth: true,
  path: '/sticky/',
  run: handler,
  schema,
};

export default GetNote;
