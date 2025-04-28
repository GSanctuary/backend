import { z } from 'zod';
import { RESTHandler, RESTMethods, RESTRoute } from '../../server';
import prisma from '../../lib/prisma';
import { GeminiClient, toContext } from '../../services/gemini';

const CONTEXT_MESSAGE_LENGTH = 25;

const schema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  conversationId: z.number(),
});

const handler: RESTHandler = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { prompt, conversationId } = schema.parse(req.body);

  const conversation = await prisma.aIConversation.findUnique({
    where: {
      id: conversationId,
    },
    select: {
      userId: true,
    },
  });

  if (conversation === null || req.user.id !== conversation?.userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const messages = await prisma.aIMessage.findMany({
    where: {
      conversationId,
    },
    select: {
      prompt: true,
      response: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: CONTEXT_MESSAGE_LENGTH,
  });

  const context = messages.map(toContext).reverse();
  const client = GeminiClient.getInstance();
  const response = await client.addContexts(context).ask(prompt).chat();

  const createdMessage = await prisma.aIMessage.create({
    data: {
      prompt,
      response,
      conversationId,
    },
  });

  res.status(201).json({ createdMessage });
};

export const Completion: RESTRoute = {
  method: RESTMethods.POST,
  path: '/ai/completion',
  run: handler,
  needsAuth: true,
  schema,
};

export default Completion;
