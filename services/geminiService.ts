import { GoogleGenAI, Type } from "@google/genai";
import { Theme, ThemeSchema } from "../types";

// Ensure we don't crash if process.env.API_KEY is undefined (e.g. during dev without env vars)
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateThemeFromPrompt = async (prompt: string): Promise<Theme | null> => {
  if (!apiKey) {
    console.warn("API Key is missing. Please set API_KEY in your environment variables.");
    return null;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Create a visually stunning color theme for a Snake game based on this concept: "${prompt}". 
      Ensure high contrast between background, snake, and food. The background should be dark enough for the glowing elements to pop.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: ThemeSchema,
        systemInstruction: "You are a UI/UX expert specializing in neon, glowing, and dreamy game aesthetics. Always return valid JSON matching the schema.",
      },
    });

    if (response.text) {
      const theme = JSON.parse(response.text) as Theme;
      return theme;
    }
    return null;
  } catch (error) {
    console.error("Failed to generate theme:", error);
    return null;
  }
};