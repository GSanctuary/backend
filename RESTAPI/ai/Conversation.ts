import prisma from '../../lib/prisma';
import { RESTHandler, RESTMethods, RESTRoute } from '../../server';

const handler: RESTHandler = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.params;
  const conversationId = parseInt(id, 10);

  const messages = await prisma.aIMessage.findMany({
    where: {
      conversationId,
    },
  });

  return res.status(200).json({ messages });
};

export const Conversation: RESTRoute = {
  method: RESTMethods.GET,
  run: handler,
  path: '/ai/conversation/:id',
  needsAuth: true,
};

export default Conversation;
