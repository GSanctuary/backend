import { z } from 'zod';
import { RESTHandler, RESTMethods, RESTRoute } from '../../server';
import prisma from '../../lib/prisma';

const schema = z.object({
  recipeName: z.string().nonempty().max(100),
});

const handler: RESTHandler = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const {recipeName} = schema.parse(req.body);
  const recipe = await prisma.recipe.create({
    data: {
      name: recipeName,
      userId: req.user.id,
    },
  });
  return res.status(201).json({ recipe });
}

export const CreateRecipe: RESTRoute = {
  method: RESTMethods.POST,
  path: "/cook/",
  schema,
  run: handler,
  needsAuth: true,
}