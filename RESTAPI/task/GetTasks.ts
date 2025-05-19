import prisma from '../../lib/prisma';
import { RESTHandler, RESTMethods, RESTRoute } from '../../server';

const handler: RESTHandler = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const tasks = await prisma.task.findMany({
    where: {
      userId: req.user.id,
      completed: false,
    },
  });

  return res.status(200).json({ tasks });
};

const GetTasks: RESTRoute = {
  method: RESTMethods.GET,
  needsAuth: true,
  path: '/task/',
  run: handler,
};

export default GetTasks;
