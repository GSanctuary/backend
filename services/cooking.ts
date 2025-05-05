import { GenerateContentConfig } from "@google/genai"
import { GeminiClient } from "./gemini"
import { z, ZodIssue } from "zod"

type IngredientEntry = {
    name: string
    quantity: string
    unit: string
}

const COOKING_SYSTEM_INSTRUCTION = `
    You are a cooking assistant. Your role is to provide cooking ingredients and instructions. Given a recipe, output the ingredients and instructions in a JSON format. The JSON should have the following structure:
    {
      "ingredients": [
        {
          "name": "ingredient name",
          "quantity": "ingredient quantity",
          "unit": "ingredient unit"
        }
      ],
      "instructions": [
        "instruction 1",
        "instruction 2"
      ]
    }
    The ingredients should be a list of objects, each containing the name, quantity, and unit of the ingredient. The instructions should be a list of strings, each representing a step in the cooking process. Do not include any additional text or explanations outside of the JSON format.
`

const JSON_ASSISTANT_INSTRUCTION = `
    You are a JSON fixing assistant. Your role is to fix broken JSON responses. Given a broken JSON response, output the fixed JSON response. The JSON should have the following structure:
    {
      "ingredients": [
        {
          "name": "ingredient name",
          "quantity": "ingredient quantity",
          "unit": "ingredient unit"
        }
      ],
      "instructions": [
        "instruction 1",
        "instruction 2"
      ]
    }
    The ingredients should be a list of objects, each containing the name, quantity, and unit of the ingredient. The instructions should be a list of strings, each representing a step in the cooking process. Do not include any additional text or explanations outside of the JSON format.
    Return the fixed JSON response.
`

const COOKING_CONFIG: GenerateContentConfig = {
    systemInstruction: COOKING_SYSTEM_INSTRUCTION,
    maxOutputTokens: 4096,
    temperature: 0.5,
}

const JSON_ASSISTANT_CONFIG: GenerateContentConfig = {
    systemInstruction: JSON_ASSISTANT_INSTRUCTION,
    maxOutputTokens: 4096,
    temperature: 0.5,
}

const MAX_RETRIES = 5;

const client = new GeminiClient(COOKING_CONFIG);
const jsonAssistant = new GeminiClient(JSON_ASSISTANT_CONFIG);

const schema = z.object({
    ingredients: z.array(
        z.object({
            name: z.string(),
            quantity: z.string(),
            unit: z.string(),
        })
    ),
    instructions: z.array(z.string()),
})

const attemptToFixJSON = async (currentResponse: string, errors: ZodIssue[]): Promise<string>=> {
    return await jsonAssistant.ask(`Response: ${currentResponse}.\nErrors: ${errors}`).chat();
}

const validateResponse = async (response: string) => {
    let currentResponse = response.trim();
    let tries = 0;

    while (tries < MAX_RETRIES) {
        tries++;
        try {
            const parsedResponse = JSON.parse(currentResponse);
            return schema.parse(parsedResponse);
        } catch (error) {
            console.log(currentResponse);
            if (error instanceof z.ZodError) {
                currentResponse = await attemptToFixJSON(currentResponse, error.errors)
                currentResponse = cleanResponse(currentResponse);
                console.log(currentResponse);
            }
        }
    }

    return schema.parse({ ingredients: [], instructions: [] });
}

const cleanResponse = (response: string): string => {
    return response
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

export const getRecipe = async (recipeName: string): Promise<{ ingredients: IngredientEntry[]; instructions: string[] }> => {
    const response = await client.ask(`Recipe: ${recipeName}`).chat();
    const cleanedResponse = cleanResponse(response);
    const validatedResponse = await validateResponse(cleanedResponse);
    return validatedResponse;
}

