import prisma from '../../lib/prisma';
import { RESTHandler, RESTMethods, RESTRoute } from '../../server';

const MAX_CONVERSATIONS = 10;

const handler: RESTHandler = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const conversations = await prisma.aIConversation.findMany({
    where: {
      userId: req.user.id,
    },
    select: {
      title: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: MAX_CONVERSATIONS,
  });

  res.status(200).json({ conversations });
};

export const AllConversations: RESTRoute = {
  method: RESTMethods.GET,
  path: '/ai/conversations',
  run: handler,
  needsAuth: true,
};

export default AllConversations;
