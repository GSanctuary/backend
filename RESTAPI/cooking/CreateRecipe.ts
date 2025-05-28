import { z } from 'zod';
import { RESTHandler, RESTMethods, RESTRoute } from '../../server';
import prisma from '../../lib/prisma';
import { Type } from '@google/genai';
import gemini from '../../lib/gemini';

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

  const response = await gemini.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: `You are an expert at writing recipies for individuals to make at home within reasonable cost ranges, feeding for individuals or families.
    You will provide ingredients with specific amounts of common units along with detailed steps for all recipies you provide. With each step, ensure to
    include proper descriptors, the ingredients used, and, if applicable, the amount of time needed for each step. If needed, also provide warnings for
    common mistakes a person may make.
    
    Please provide a recipe for: ${recipeName}`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          ingredients: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
          },
          steps: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
          },
        },
        propertyOrdering: ['ingredients', 'steps'],
      },
    },
  });

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
