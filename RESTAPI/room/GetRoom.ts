import { RESTHandler, RESTMethods, RESTRoute } from '../../server';
import prisma from '../../lib/prisma';
import { sanitizeRoom } from '../../types/room';
import z from 'zod';

const schema = z.object({
  anchorId: z.string().nonempty(),
});

const handler: RESTHandler = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { anchorId } = schema.parse(req.query);
  const room = await prisma.room.findFirst({
    where: {
      userId: req.user.id,
      anchorId,
    },
  });

  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }

  return res.status(200).json({ room: sanitizeRoom(room) });
};

const GetRoom: RESTRoute = {
  method: RESTMethods.GET,
  needsAuth: true,
  path: '/rooms',
  run: handler,
};

export default GetRoom;
