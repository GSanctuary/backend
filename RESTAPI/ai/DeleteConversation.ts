import prisma from '../../lib/prisma';
import { RESTHandler, RESTMethods, RESTRoute } from '../../server';

const handler: RESTHandler = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.params;
  const conversationId = parseInt(id, 10);
  if (isNaN(conversationId)) {
    return res.status(400).json({ message: 'Invalid conversation ID' });
  }

  const conversation = await prisma.aIConversation.findUnique({
    where: {
      id: conversationId,
    },
  });

  if (!conversation || conversation.userId !== req.user.id) {
    return res.status(404).json({ message: 'Conversation not found' });
  }

  await prisma.aIConversation.delete({
    where: {
      id: conversationId,
    },
  });

  return res.status(204).json({ message: 'Conversation deleted successfully' });
};

const DeleteConversation: RESTRoute = {
  method: RESTMethods.DELETE,
  run: handler,
  needsAuth: true,
  path: '/ai/conversation/:id',
};

export default DeleteConversation;
