import { z } from 'zod';
import { RESTHandler, RESTMethods, RESTRoute } from '../../server';
import prisma from '../../lib/prisma';

const schema = z.object({
  content: z.string().min(1, 'Content is required'),
  metadata: z.record(z.string(), z.any()),
  noteId: z.number().int().positive('Note ID must be a positive integer'),
});

// TODO: add buffer + caching, this route might be accessed frequently
const handler: RESTHandler = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { content, metadata, noteId } = schema.parse(req.body);
  const note = await prisma.stickyNote.update({
    where: {
      id: noteId,
      userId: req.user.id,
    },
    data: {
      content,
      metadata,
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

const UpdateNote: RESTRoute = {
  method: RESTMethods.PUT,
  needsAuth: true,
  path: '/sticky/',
  run: handler,
  schema,
};

export default UpdateNote;
