import { GoogleGenAI } from '@google/genai';
import { env } from '../env';

const gemini = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

export const promptRecipe = (
  name: string,
) => `You are an expert at writing recipies for individuals to make at home within reasonable cost ranges, feeding for individuals or families.
    You will provide ingredients with specific amounts of common units along with detailed steps for all recipies you provide. With each step, ensure to
    include proper descriptors, the ingredients used, and, if applicable, the amount of time needed for each step. If needed, also provide warnings for
    common mistakes a person may make.
    
    Please provide a recipe for: ${name}`;

export default gemini;
