import { z } from 'zod';
import { RESTHandler, RESTMethods, RESTRoute } from '../../server';
import prisma from '../../lib/prisma';
import { COOKING_CONFIG, GeminiClient } from '../../services/gemini';

const schema = z.object({
  recipeName: z.string().nonempty().max(100),
});

const recipeSchema = z.object({
  ingredients: z.array(z.string()).nonempty(),
  steps: z.array(z.string()).nonempty(),
});

const handler: RESTHandler = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { recipeName } = schema.parse(req.body);

  const recipe = await prisma.recipe.findFirst({
    where: {
      name: recipeName,
      userId: req.user.id,
    },
  });
  if (!!recipe) {
    return res.status(409).json({ error: 'Recipe already exists' });
  }

  const response = await new GeminiClient(COOKING_CONFIG).recipe(recipeName);

  try {
    const output = recipeSchema.parse(response.text!);

    const recipe = await prisma.recipe.create({
      data: {
        name: recipeName,
        ...output,
        userId: req.user.id,
      },
    });
    return res.status(201).json({ recipe });
  } catch {
    return res.status(502).json({ error: 'Unable to generate recipe' });
  }
};

const CreateRecipe: RESTRoute = {
  method: RESTMethods.POST,
  path: '/cook',
  schema,
  run: handler,
  needsAuth: true,
};

export default CreateRecipe;
