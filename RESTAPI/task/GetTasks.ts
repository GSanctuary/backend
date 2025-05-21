import prisma from '../../lib/prisma';
import { RESTHandler, RESTMethods, RESTRoute } from '../../server';

const handler: RESTHandler = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  let pageNumber = parseInt(req.query.pageNumber as string);
  let pageSize = parseInt(req.query.pageSize as string);

  if (isNaN(pageNumber) || pageNumber <= 0) {
    pageNumber = 1;
  }

  if (isNaN(pageSize) || pageSize <= 0) {
    pageSize = 10;
  }

  const [count, tasks] = await prisma.$transaction([
    prisma.task.count({ where: { userId: req.user.id, completed: false } }),
    prisma.task.findMany({
      where: {
        userId: req.user.id,
        completed: false,
      },
      skip: pageSize * (pageNumber - 1),
      take: pageSize,
      orderBy: {
        createdAt: 'desc',
      },
    }),
  ]);

  return res.status(200).json({
    tasks,
    page: pageNumber,
    pageCount: Math.ceil(count / pageSize),
    count,
  });
};

const GetTasks: RESTRoute = {
  method: RESTMethods.GET,
  needsAuth: true,
  path: '/task/',
  run: handler,
};

export default GetTasks;
