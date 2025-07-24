import { z } from 'zod';
import { RESTHandler, RESTMethods, RESTRoute } from '../../server';
import prisma from '../../lib/prisma';

const schema = z.object({
  task: z.string().nonempty().max(100),
  room: z.string().nonempty(),
});

const handler: RESTHandler = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { task: name, room } = schema.parse(req.body);
  const taskInfo = await prisma.task.create({
    data: {
      name,
      userId: req.user.id,
      roomId: room,
    },
  });

  if (!taskInfo) {
    return res.status(500).json({ error: 'Failed to create task' });
  }

  res.status(201).json({
    task: taskInfo,
  });
};

const CreateTask: RESTRoute = {
  method: RESTMethods.POST,
  needsAuth: true,
  path: '/task/',
  schema,
  run: handler,
};

export default CreateTask;
