import { z } from 'zod';
import { RESTHandler, RESTMethods, RESTRoute } from '../../server';
import prisma from '../../lib/prisma';
import { sanitizeRoom } from '../../types/room';

const schema = z.object({
  positions: z
    .array(z.tuple([z.number(), z.number(), z.number()]))
    .min(1, 'There must be at least one position')
    .max(100, 'Too many positions (are you sure this is correct?)'),
  scale: z.tuple([z.number(), z.number()]),
  name: z.string().max(100).nonempty(),
});

const handler: RESTHandler = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { positions, scale, name } = schema.parse(req.body);

  const r = await prisma.room.findFirst({
    where: { name, userId: req.user.id },
  });

  if (!!r) {
    return res.status(404).json({ error: 'Room names must be unique' });
  }

  const room = await prisma.room.create({
    data: {
      positions: positions.flat(1),
      scaleX: scale[0],
      scaleY: scale[1],
      name,
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
