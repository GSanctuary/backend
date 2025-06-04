import { RESTHandler, RESTMethods, RESTRoute } from '../../server';
import prisma from '../../lib/prisma';

const handler: RESTHandler = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const notes = await prisma.stickyNote.findMany({
    where: {
      userId: req.user.id,
    },
  });

  return res.json({ notes });
};

const GetNote: RESTRoute = {
  method: RESTMethods.GET,
  needsAuth: true,
  path: '/sticky/',
  run: handler,
};

export default GetNote;
