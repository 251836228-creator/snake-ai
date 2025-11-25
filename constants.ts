import { Theme } from "./types";

export const GRID_SIZE = 20;
export const INITIAL_SPEED = 150;
export const MIN_SPEED = 60;
export const SPEED_DECREMENT = 2; // Milliseconds faster per apple

export const DEFAULT_THEME: Theme = {
  name: "Neon Dreams",
  description: "The classic synthwave aesthetic.",
  colors: {
    backgroundFrom: "#0f172a", // slate-900
    backgroundTo: "#1e1b4b",   // indigo-950
    gridLines: "rgba(255, 255, 255, 0.05)",
    snakeHead: "#d8b4fe",      // purple-300
    snakeBody: "#a855f7",      // purple-500
    snakeGlow: "#a855f7",
    food: "#22d3ee",           // cyan-400
    foodGlow: "#22d3ee",
    text: "#f8fafc"
  }
};

export const PRESET_THEMES: Theme[] = [
  DEFAULT_THEME,
  {
    name: "Sakura Drift",
    description: "Soft pinks and calming whites.",
    colors: {
      backgroundFrom: "#4a044e",
      backgroundTo: "#831843",
      gridLines: "rgba(255, 200, 200, 0.1)",
      snakeHead: "#fbcfe8",
      snakeBody: "#f472b6",
      snakeGlow: "#f472b6",
      food: "#fef08a",
      foodGlow: "#fef08a",
      text: "#fff1f2"
    }
  },
  {
    name: "Cyber Matrix",
    description: "Digital rain and terminal vibes.",
    colors: {
      backgroundFrom: "#022c22",
      backgroundTo: "#000000",
      gridLines: "rgba(34, 197, 94, 0.1)",
      snakeHead: "#86efac",
      snakeBody: "#22c55e",
      snakeGlow: "#22c55e",
      food: "#ef4444",
      foodGlow: "#ef4444",
      text: "#86efac"
    }
  }
];