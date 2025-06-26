import {
  GenerateContentConfig,
  GenerateContentResponse,
  GoogleGenAI,
  Type,
} from '@google/genai';
import { env } from '../env';

interface Context {
  prompt: string;
  response: string;
}

export const toContext = ({
  prompt,
  response,
}: {
  prompt: string;
  response: string;
}): Context => ({ prompt, response });

const ASSISTENT_SYSTEM_INSTRUCTION = `You are a helpful butler. You will be given a context and a prompt. Your task is to generate a response based on the context and the prompt. The context will be in the format of <CONTEXT>...</CONTEXT>. The prompt will be provided after the context. You should not include the context in your response. Your response should be a single string.`;

const COOKING_SYSTEM_INSTRUCTION = `You are an expert at writing recipies for individuals to make at home within reasonable cost ranges, feeding for individuals or families. You will provide ingredients with specific amounts of common units along with detailed steps for all recipies you provide. With each step, ensure to include proper descriptors, the ingredients used, and, if applicable, the amount of time needed for each step. If needed, also provide warnings for common mistakes a person may make.`;

export const DEFAULT_CONFIG: GenerateContentConfig = {
  systemInstruction: ASSISTENT_SYSTEM_INSTRUCTION,
  maxOutputTokens: 4096,
  temperature: 0.5,
};

export const COOKING_CONFIG: GenerateContentConfig = {
  systemInstruction: COOKING_SYSTEM_INSTRUCTION,
  maxOutputTokens: 4096,
  temperature: 0.5,
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
};

export class GeminiClient {
  private client: GoogleGenAI;
  private contexts: Context[] = [];
  private prompt: string = '';
  private config: GenerateContentConfig = DEFAULT_CONFIG;

  constructor(config: GenerateContentConfig = DEFAULT_CONFIG) {
    this.client = new GoogleGenAI({
      apiKey: env.GEMINI_API_KEY,
    });
    this.config = config;
  }

  ask = (prompt: string): GeminiClient => {
    this.prompt = prompt;
    return this;
  };

  addContext = (context: Context): GeminiClient => {
    this.contexts.push(context);
    return this;
  };

  addContexts = (contexts: Context[]): GeminiClient => {
    this.contexts = [...this.contexts, ...contexts];
    return this;
  };

  clearContexts = (): GeminiClient => {
    this.contexts = [];
    return this;
  };

  chat = async (): Promise<string> => {
    console.log('Contexts:', this.buildPrompt());
    const response = await this.client.models
      .generateContent({
        model: 'gemini-2.0-flash',
        contents: this.buildPrompt(),
        config: this.config,
      })
      .catch(this.handleError);
    return response.text ?? 'No response.';
  };

  recipe = async (item: string): Promise<GenerateContentResponse> => {
    return this.client.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Provide a recipe for: ${item}`,
      config: this.config,
    });
  };

  private handleError = (error: any): { text: string } => {
    // Log error and return graceful error message
    console.error('Error:', error);
    return { text: 'An error occurred.' };
  };

  private buildContext = (): string => {
    return this.contexts
      .map(
        (context) => `Prompt: ${context.prompt}\nResponse: ${context.response}`,
      )
      .join('\n');
  };

  private buildPrompt = (): string => {
    return `<CONTEXT>\n${this.buildContext()}</CONTEXT>\nPrompt: ${
      this.prompt
    }`;
  };
}
