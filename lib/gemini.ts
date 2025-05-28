import { GoogleGenAI } from '@google/genai';
import { env } from '../env';

const gemini = new GoogleGenAI({ apiKey: env.gemini_key });

export default gemini;
