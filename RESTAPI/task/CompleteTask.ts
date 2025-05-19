import { z } from 'zod';
import { RESTHandler, RESTMethods, RESTRoute } from '../../server';
import prisma from '../../lib/prisma';

const schema = z.object({
  taskIds: z.array(z.number()).nonempty(),
});

const handler: RESTHandler = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { taskIds } = schema.parse(req.body);
  const tasks = await prisma.task.updateMany({
    where: {
      id: {
        in: taskIds,
      },
      userId: req.user.id,
      completed: false,
    },
    data: {
      completed: true,
    },
  });

  // Delete completed tasks for now, might want to keep them in the future
  await prisma.task.deleteMany({
    where: {
      id: {
        in: taskIds,
      },
      userId: req.user.id,
      completed: true,
    },
  });

  if (tasks.count !== taskIds.length) {
    return res.status(404).json({
      error: 'Some tasks not found or already completed',
      count: tasks.count,
    });
  }

  return res.status(201).json({ count: tasks.count });
};

const CompleteTask: RESTRoute = {
  method: RESTMethods.PUT,
  needsAuth: true,
  path: '/task/complete/',
  schema,
  run: handler,
};

export default CompleteTask;
