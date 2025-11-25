import { Type } from "@google/genai";

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT'
}

export enum GameStatus {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER'
}

export interface Coordinate {
  x: number;
  y: number;
}

export interface Theme {
  name: string;
  description: string;
  colors: {
    backgroundFrom: string; // CSS Color or Hex
    backgroundTo: string;   // CSS Color or Hex
    gridLines: string;      // Low opacity color
    snakeHead: string;
    snakeBody: string;
    snakeGlow: string;      // Shadow color
    food: string;
    foodGlow: string;
    text: string;
  };
}

// Gemini Schema for Theme Generation
export const ThemeSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "A creative name for the theme" },
    description: { type: Type.STRING, description: "Short description of the vibe" },
    colors: {
      type: Type.OBJECT,
      properties: {
        backgroundFrom: { type: Type.STRING, description: "Dark gradient start (Hex)" },
        backgroundTo: { type: Type.STRING, description: "Dark gradient end (Hex)" },
        gridLines: { type: Type.STRING, description: "Very subtle grid line color (rgba/hex)" },
        snakeHead: { type: Type.STRING, description: "Bright distinct color for head" },
        snakeBody: { type: Type.STRING, description: "Complementary color for body" },
        snakeGlow: { type: Type.STRING, description: "Color for the glow effect (usually same as body/head)" },
        food: { type: Type.STRING, description: "Bright contrasting color for food" },
        foodGlow: { type: Type.STRING, description: "Glow color for food" },
        text: { type: Type.STRING, description: "Readable text color against background" },
      },
      required: ["backgroundFrom", "backgroundTo", "gridLines", "snakeHead", "snakeBody", "snakeGlow", "food", "foodGlow", "text"]
    }
  },
  required: ["name", "description", "colors"]
};