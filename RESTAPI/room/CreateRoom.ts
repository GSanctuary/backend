import { z } from 'zod';
import { RESTHandler, RESTMethods, RESTRoute } from '../../server';
import prisma from '../../lib/prisma';
import { sanitizeRoom } from '../../types/room';

const schema = z.object({
  position: z.tuple([z.number(), z.number(), z.number()]),
  scale: z.tuple([z.number(), z.number()]),
  rotation: z.number(),
  name: z.string().max(100).nonempty(),
  anchorId: z.string().nonempty(),
});

const handler: RESTHandler = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { position, scale, rotation, name, anchorId } = schema.parse(req.body);

  const room = await prisma.room.create({
    data: {
      positionX: position[0],
      positionY: position[1],
      positionZ: position[2],
      scaleX: scale[0],
      scaleZ: scale[1],
      name,
      anchorId,
      rotation,
      userId: req.user.id,
    },
  });
  return res.status(201).json({ room: sanitizeRoom(room) });
};

const CreateRoom: RESTRoute = {
  method: RESTMethods.POST,
  path: '/rooms',
  schema,
  run: handler,
  needsAuth: true,
};

export default CreateRoom;
