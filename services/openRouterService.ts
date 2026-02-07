import { Goal, Tactic, Cycle } from "../types";

const MODEL = "arcee-ai/trinity-large-preview:free";
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// Helper to get the API key from environment variables
const getApiKey = (): string => {
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || "";
    if (!apiKey) {
        console.error("OpenRouter API Key is missing. Check .env for VITE_OPENROUTER_API_KEY");
        throw new Error("OpenRouter API Key not found. Please check your settings.");
    }
    return apiKey;
};

// Generic function to make chat completion requests to OpenRouter
interface ChatMessage {
    role: "user" | "assistant" | "system";
    content: string;
}

interface OpenRouterResponse {
    choices: {
        message: {
            content: string;
        };
    }[];
}

const chatCompletion = async (
    messages: ChatMessage[],
    temperature: number = 0.7
): Promise<string> => {
    const apiKey = getApiKey();

    // Create an AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

    try {
        console.log("Making OpenRouter API request...");

        const response = await fetch(OPENROUTER_API_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: MODEL,
                messages,
                temperature,
            }),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("OpenRouter API error:", response.status, errorText);
            throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log("OpenRouter API response:", data);

        // Handle different response formats (some models return reasoning separately)
        if (data.choices && data.choices[0]) {
            const choice = data.choices[0];
            // Check for content in message
            if (choice.message?.content) {
                return choice.message.content;
            }
            // Some reasoning models may have different structure
            if (choice.text) {
                return choice.text;
            }
        }

        console.error("Unexpected response format:", data);
        throw new Error("Unexpected response format from OpenRouter API");
    } catch (error: any) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error("Request timed out. The AI is taking too long to respond.");
        }
        throw error;
    }
};

// Helper to extract JSON from response (handles markdown code blocks)
const extractJSON = (text: string): string => {
    // Try to extract JSON from markdown code blocks
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
        return jsonMatch[1].trim();
    }
    // If no code block, try to find JSON array or object directly
    const jsonArrayMatch = text.match(/\[[\s\S]*\]/);
    if (jsonArrayMatch) {
        return jsonArrayMatch[0];
    }
    const jsonObjectMatch = text.match(/\{[\s\S]*\}/);
    if (jsonObjectMatch) {
        return jsonObjectMatch[0];
    }
    return text.trim();
};

export const getAIFeedback = async (vision: string, currentGoals: Goal[]): Promise<string> => {
    const messages: ChatMessage[] = [
        {
            role: "user",
            content: `Analyze this 12 Week Year plan as a performance coach.
      Vision: ${vision}
      Goals: ${JSON.stringify(currentGoals)}
      
      Give me a concise critique and 3 "Power Actions" to ensure 85% execution.`,
        },
    ];

    return await chatCompletion(messages, 0.7);
};

export const getCorrectiveAction = async (cycle: Cycle, weekIndex: number): Promise<string> => {
    const week = cycle.executions[weekIndex];
    const messages: ChatMessage[] = [
        {
            role: "user",
            content: `The user's execution score was ${week.score}% in week ${weekIndex + 1}. 
      Based on these goals: ${JSON.stringify(cycle.goals)}, 
      suggest a "Corrective Recovery Plan" for next week to get back to 85%+. 
      Focus on removing obstacles and simplifying tactics.`,
        },
    ];

    return await chatCompletion(messages);
};

export const generateVisionPrompts = async (): Promise<string[]> => {
    const messages: ChatMessage[] = [
        {
            role: "user",
            content: `Generate 5 thought-provoking questions to help someone define a '12 Week Year' compelling vision. Make them challenging and future-focused.
      
      IMPORTANT: Respond ONLY with a JSON array of 5 strings. No other text.
      Example format: ["Question 1?", "Question 2?", "Question 3?", "Question 4?", "Question 5?"]`,
        },
    ];

    const response = await chatCompletion(messages);
    try {
        const jsonStr = extractJSON(response);
        return JSON.parse(jsonStr);
    } catch (e) {
        console.error("Failed to parse vision prompts:", e);
        return [
            "What would make this the most transformative 12 weeks of your life?",
            "What fear are you finally ready to overcome?",
            "If failure were impossible, what would you pursue?",
            "What daily habit would fundamentally change your trajectory?",
            "What will you regret NOT starting in the next 12 weeks?",
        ];
    }
};

export const refineVision = async (vision: string): Promise<string> => {
    const messages: ChatMessage[] = [
        {
            role: "user",
            content: `Refine this vision statement into a compelling, clear, and emotional 1-page vision. 
      Vision draft: "${vision}"
      Make it punchy, present-tense, and highly motivating. Use markdown if necessary.`,
        },
    ];

    return await chatCompletion(messages);
};

export const suggestTactics = async (goal: string): Promise<Partial<Tactic>[]> => {
    const messages: ChatMessage[] = [
        {
            role: "user",
            content: `Suggest 3-5 high-impact tactics for a 12-week goal: "${goal}". 
      Tactics must be daily or weekly repeatable actions. Lead indicators only.
      
      IMPORTANT: Respond ONLY with a JSON array of objects with these properties:
      - description (string): what the tactic is
      - frequency (string): either "daily" or "weekly"
      - target (number): how many times to complete
      
      Example format: [{"description": "Write for 30 minutes", "frequency": "daily", "target": 1}]`,
        },
    ];

    const response = await chatCompletion(messages);
    try {
        const jsonStr = extractJSON(response);
        return JSON.parse(jsonStr);
    } catch (e) {
        console.error("Failed to parse tactics:", e);
        return [];
    }
};
