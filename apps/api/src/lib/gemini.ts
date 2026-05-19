import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from './env';

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

// Always use this model. Never hardcode model strings elsewhere.
export const MODEL = 'gemini-2.5-flash';
export const getModel = () => genAI.getGenerativeModel({ model: MODEL });
