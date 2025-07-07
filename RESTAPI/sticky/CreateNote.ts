import { z } from 'zod';
import { RESTHandler, RESTMethods, RESTRoute } from '../../server';
import prisma from '../../lib/prisma';

const schema = z.object({
  content: z.string().min(1, 'Content is required'),
  metadata: z.record(z.string(), z.any()),
  room: z.number(),
});

const handler: RESTHandler = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Implement logic here
  const { content, metadata, room } = schema.parse(req.body);
  const note = await prisma.stickyNote.create({
    data: {
      content,
      metadata,
      userId: req.user.id,
      roomId: room,
    },
  });

  res.status(201).json({ note });
};

const CreateNote: RESTRoute = {
  method: RESTMethods.POST,
  needsAuth: true,
  path: '/sticky/',
  run: handler,
  schema,
};

export default CreateNote;
