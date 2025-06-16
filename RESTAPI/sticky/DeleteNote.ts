import { z } from 'zod';
import { RESTHandler, RESTMethods, RESTRoute } from '../../server';
import prisma from '../../lib/prisma';

const handler: RESTHandler = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Implement logic here
  const { id: rawId } = req.query;

  if (typeof rawId !== 'string') {
    return res.status(400).json({ error: 'Invalid note ID' });
  }

  const id = parseInt(rawId, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid note ID' });
  }

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
