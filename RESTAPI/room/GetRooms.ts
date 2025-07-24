import { RESTHandler, RESTMethods, RESTRoute } from '../../server';
import prisma from '../../lib/prisma';
import { sanitizeRoom } from '../../types/room';

const handler: RESTHandler = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const rooms = await prisma.room.findMany({
    where: {
      userId: req.user.id,
    },
  });

  return res.status(200).json({ rooms: rooms.map(sanitizeRoom) });
};

const GetRooms: RESTRoute = {
  method: RESTMethods.GET,
  needsAuth: true,
  path: '/rooms',
  run: handler,
};

export default GetRooms;
