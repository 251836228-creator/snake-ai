import React, { useEffect, useRef } from 'react';
import { Coordinate, Theme, GameStatus } from '../types';
import { GRID_SIZE } from '../constants';

interface GameBoardProps {
  snake: Coordinate[];
  food: Coordinate;
  theme: Theme;
  status: GameStatus;
}

const GameBoard: React.FC<GameBoardProps> = ({ snake, food, theme, status }) => {
  // We use CSS Grid for rendering the cells. 
  // An array of size GRID_SIZE * GRID_SIZE
  const cells = Array.from({ length: GRID_SIZE * GRID_SIZE });

  // Calculate cell styles based on state
  const getCellStyle = (index: number) => {
    const x = index % GRID_SIZE;
    const y = Math.floor(index / GRID_SIZE);

    const isFood = food.x === x && food.y === y;
    const snakeIndex = snake.findIndex(s => s.x === x && s.y === y);
    const isHead = snakeIndex === 0;
    const isBody = snakeIndex > 0;

    const baseStyle: React.CSSProperties = {
      transition: 'all 0.1s ease-in-out',
      borderRadius: '25%', // Slight rounding for a softer look
    };

    if (isFood) {
      return {
        ...baseStyle,
        backgroundColor: theme.colors.food,
        boxShadow: `0 0 15px 2px ${theme.colors.foodGlow}`,
        transform: 'scale(0.8)',
        borderRadius: '50%',
        animation: 'pulse 1.5s infinite'
      };
    }

    if (isHead) {
      return {
        ...baseStyle,
        backgroundColor: theme.colors.snakeHead,
        boxShadow: `0 0 20px 5px ${theme.colors.snakeGlow}`,
        zIndex: 10,
        transform: 'scale(1.1)',
        borderRadius: '30%'
      };
    }

    if (isBody) {
      // Fade the tail slightly
      const opacity = 1 - (snakeIndex / (snake.length + 5));
      return {
        ...baseStyle,
        backgroundColor: theme.colors.snakeBody,
        boxShadow: `0 0 10px 1px ${theme.colors.snakeGlow}`,
        opacity: Math.max(0.3, opacity),
      };
    }

    return {
      border: `1px solid ${theme.colors.gridLines}`,
    };
  };

  return (
    <div className="relative">
      <div 
        className="grid gap-0 relative backdrop-blur-sm rounded-lg overflow-hidden shadow-2xl border border-white/10"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          width: 'min(90vw, 400px)',
          height: 'min(90vw, 400px)',
          backgroundColor: 'rgba(0,0,0,0.2)'
        }}
      >
        {cells.map((_, index) => (
          <div key={index} style={getCellStyle(index)} />
        ))}
      </div>

      {/* Overlay for Game Over / Pause */}
      {(status === GameStatus.GAME_OVER || status === GameStatus.PAUSED || status === GameStatus.IDLE) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs rounded-lg z-20">
          <div className="text-center animate-bounce-slow">
            <h2 
              className="text-4xl font-bold mb-2 drop-shadow-lg"
              style={{ color: theme.colors.food }}
            >
              {status === GameStatus.GAME_OVER ? 'GAME OVER' : status === GameStatus.PAUSED ? 'PAUSED' : 'READY?'}
            </h2>
            {status === GameStatus.GAME_OVER && (
               <p className="text-white text-sm opacity-80">Tap to dream again</p>
            )}
             {status === GameStatus.IDLE && (
               <p className="text-white text-sm opacity-80">Tap start or use arrows</p>
            )}
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(0.8); opacity: 1; }
          50% { transform: scale(0.95); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

export default GameBoard;