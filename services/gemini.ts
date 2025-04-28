import { GenerateContentConfig, GoogleGenAI } from '@google/genai';
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

const SYSTEM_INSTRUCTION = `You are a helpful assistant. You will be given a context and a prompt. Your task is to generate a response based on the context and the prompt. The context will be in the format of <CONTEXT>...</CONTEXT>. The prompt will be provided after the context. You should not include the context in your response. Your response should be a single string.`;

const DEFAULT_CONFIG: GenerateContentConfig = {
  systemInstruction: SYSTEM_INSTRUCTION,
  maxOutputTokens: 4096,
  temperature: 0.5,
};

export class GeminiClient {
  private client: GoogleGenAI;
  private contexts: Context[] = [];
  private prompt: string = '';
  private config: GenerateContentConfig = DEFAULT_CONFIG;
  private static instance: GeminiClient | undefined = undefined;

  private constructor() {
    this.client = new GoogleGenAI({
      apiKey: env.GEMINI_API_KEY,
    });
  }

  static getInstance = (): GeminiClient => {
    if (!GeminiClient.instance) {
      GeminiClient.instance = new GeminiClient();
    }
    return GeminiClient.instance;
  };

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

  chat = async (): Promise<string> => {
    const response = await this.client.models
      .generateContent({
        model: 'gemini-2.0-flash',
        contents: this.buildPrompt(),
        config: this.config,
      })
      .catch(this.handleError);
    return response.text ?? 'No response.';
  };

  private handleError = (error: any): { text: string } => {
    // Log error and return graceful error message
    console.error('Error:', error);
    return { text: 'An error occurred.' };
  };

  private buildContext = (): string => {
    return this.contexts
      .map((context) => `${context.prompt}\n${context.response}`)
      .join('\n');
  };

  private buildPrompt = (): string => {
    return `<CONTEXT>\n${this.buildContext()}</CONTEXT>\n${this.prompt}`;
  };
}
