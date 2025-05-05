import { z } from 'zod';
import { RESTHandler, RESTMethods, RESTRoute } from '../../server';
import prisma from '../../lib/prisma';
import { getRecipe } from '../../services/cooking';

const schema = z.object({
  recipeName: z.string().nonempty().max(100),
})

const handler: RESTHandler = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { recipeName } = schema.parse(req.query);
  const recipe = await prisma.recipe.findFirst({
    where: {
      name: recipeName,
      userId: req.user.id,
    },
  });
  if (!recipe) {
    return res.status(404).json({ error: 'Recipe not found' });
  }

  const recipeInfo = await getRecipe(recipe.name);

  return res.status(200).json({...recipeInfo});
}

const GetRecipe: RESTRoute = {
  method: RESTMethods.GET,
  needsAuth: true,
  path: '/cook/',
  run: handler,
}

export default GetRecipe;