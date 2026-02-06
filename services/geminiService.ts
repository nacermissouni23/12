
import { GoogleGenAI, Type } from "@google/genai";
import { Goal, Tactic, Cycle } from "../types";

const MODEL = 'gemini-2.0-flash';

// Helper to initialize the GenAI client using the environment's API key.
// In Vite, variables prefixed with VITE_ are exposed on import.meta.env
const getClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.API_KEY || ''; 
  if (!apiKey) {
      console.error("GEMINI API Key is missing. Check .env for VITE_GEMINI_API_KEY");
  }
  return new GoogleGenAI({ apiKey });
};

export const getAIFeedback = async (vision: string, currentGoals: Goal[]) => {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: `
      Analyze this 12 Week Year plan as a performance coach.
      Vision: ${vision}
      Goals: ${JSON.stringify(currentGoals)}
      
      Give me a concise critique and 3 "Power Actions" to ensure 85% execution.
    `,
    config: { temperature: 0.7 }
  });
  
  // Accessing text as a property of GenerateContentResponse.
  return response.text || '';
};

export const getCorrectiveAction = async (cycle: Cycle, weekIndex: number) => {
  const week = cycle.executions[weekIndex];
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: `The user's execution score was ${week.score}% in week ${weekIndex + 1}. 
    Based on these goals: ${JSON.stringify(cycle.goals)}, 
    suggest a "Corrective Recovery Plan" for next week to get back to 85%+. 
    Focus on removing obstacles and simplifying tactics.`,
  });
  return response.text || '';
};

export const generateVisionPrompts = async () => {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: "Generate 5 thought-provoking questions to help someone define a '12 Week Year' compelling vision. Make them challenging and future-focused.",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });
  const text = response.text;
  return text ? JSON.parse(text.trim()) : [];
};

export const refineVision = async (vision: string) => {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: `Refine this vision statement into a compelling, clear, and emotional 1-page vision. 
    Vision draft: "${vision}"
    Make it punchy, present-tense, and highly motivating. Use markdown if necessary.`,
  });
  return response.text || '';
};

export const suggestTactics = async (goal: string): Promise<Partial<Tactic>[]> => {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: `Suggest 3-5 high-impact tactics for a 12-week goal: "${goal}". 
    Tactics must be daily or weekly repeatable actions. Lead indicators only.`,
    config: {
      responseMimeType: "application/json",
      // Using Type enum from @google/genai for structured output.
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            frequency: { type: Type.STRING },
            target: { type: Type.NUMBER }
          },
          required: ["description", "frequency", "target"]
        }
      }
    }
  });
  const text = response.text;
  return text ? JSON.parse(text.trim()) : [];
};
