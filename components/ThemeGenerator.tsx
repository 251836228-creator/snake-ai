import React, { useState } from 'react';
import { generateThemeFromPrompt } from '../services/geminiService';
import { Theme } from '../types';
import { PRESET_THEMES } from '../constants';

interface ThemeGeneratorProps {
  onThemeSelect: (theme: Theme) => void;
  currentTheme: Theme;
}

const ThemeGenerator: React.FC<ThemeGeneratorProps> = ({ onThemeSelect, currentTheme }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const newTheme = await generateThemeFromPrompt(prompt);
      if (newTheme) {
        onThemeSelect(newTheme);
        setPrompt('');
      } else {
        setError("AI couldn't dream up a theme. Try again.");
      }
    } catch (err) {
      setError("Something went wrong with the dream machine.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 shadow-xl mb-6">
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2" style={{ color: currentTheme.colors.text }}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
        Dream Weaver AI
      </h3>

      <form onSubmit={handleGenerate} className="flex gap-2 mb-4">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., 'Volcanic Ash', 'Bubblegum Cloud'..."
          className="flex-1 bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
          disabled={isGenerating}
        />
        <button
          type="submit"
          disabled={isGenerating || !prompt.trim()}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center min-w-[100px]
            ${isGenerating ? 'bg-white/10 cursor-not-allowed' : 'bg-white/20 hover:bg-white/30 active:scale-95'}`}
          style={{ color: currentTheme.colors.text }}
        >
          {isGenerating ? (
            <div className="w-5 h-5 border-2 border-t-transparent border-current rounded-full animate-spin"></div>
          ) : (
            'Dream'
          )}
        </button>
      </form>

      {error && <p className="text-red-300 text-sm mb-3">{error}</p>}

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {PRESET_THEMES.map((theme, idx) => (
          <button
            key={idx}
            onClick={() => onThemeSelect(theme)}
            className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-white/30 hover:scale-110 transition-transform"
            style={{
              background: `linear-gradient(135deg, ${theme.colors.snakeHead}, ${theme.colors.backgroundTo})`,
              borderColor: currentTheme.name === theme.name ? theme.colors.food : 'rgba(255,255,255,0.3)'
            }}
            title={theme.name}
          />
        ))}
      </div>
      <p className="text-xs mt-2 opacity-60" style={{ color: currentTheme.colors.text }}>
        Current: {currentTheme.name}
      </p>
    </div>
  );
};

export default ThemeGenerator;