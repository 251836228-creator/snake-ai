import React, { useState, useEffect, useCallback, useRef } from 'react';
import GameBoard from './components/GameBoard';
import ThemeGenerator from './components/ThemeGenerator';
import { Direction, GameStatus, Coordinate, Theme } from './types';
import { GRID_SIZE, INITIAL_SPEED, MIN_SPEED, SPEED_DECREMENT, DEFAULT_THEME } from './constants';

const App: React.FC = () => {
  // Game State
  const [snake, setSnake] = useState<Coordinate[]>([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]);
  const [food, setFood] = useState<Coordinate>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(Direction.UP);
  const [nextDirection, setNextDirection] = useState<Direction>(Direction.UP); // Prevent rapid double turns
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  
  // Theme State
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);

  // Refs for intervals and audio
  const gameLoopRef = useRef<number | null>(null);

  // Initialize High Score
  useEffect(() => {
    const saved = localStorage.getItem('dreamSnakeHighScore');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('dreamSnakeHighScore', score.toString());
    }
  }, [score, highScore]);

  // Generate random coordinate not on snake
  const getRandomCoordinate = useCallback((): Coordinate => {
    let newFood: Coordinate;
    let isOnSnake = true;
    while (isOnSnake) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      // eslint-disable-next-line no-loop-func
      isOnSnake = snake.some(s => s.x === newFood.x && s.y === newFood.y);
      if (!isOnSnake) return newFood;
    }
    return { x: 0, y: 0 }; // Fallback
  }, [snake]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]);
    setDirection(Direction.UP);
    setNextDirection(Direction.UP);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setFood(getRandomCoordinate());
    setStatus(GameStatus.PLAYING);
  };

  const handleGameOver = () => {
    setStatus(GameStatus.GAME_OVER);
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
  };

  const moveSnake = useCallback(() => {
    if (status !== GameStatus.PLAYING) return;

    setDirection(nextDirection);

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (nextDirection) {
        case Direction.UP: newHead.y -= 1; break;
        case Direction.DOWN: newHead.y += 1; break;
        case Direction.LEFT: newHead.x -= 1; break;
        case Direction.RIGHT: newHead.x += 1; break;
      }

      // Check Walls
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        handleGameOver();
        return prevSnake;
      }

      // Check Self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        handleGameOver();
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check Food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 1);
        setSpeed(s => Math.max(MIN_SPEED, s - SPEED_DECREMENT));
        setFood(getRandomCoordinate());
        // Don't pop tail (grow)
      } else {
        newSnake.pop(); // Remove tail
      }

      return newSnake;
    });
  }, [status, nextDirection, food, getRandomCoordinate]);

  // Game Loop
  useEffect(() => {
    if (status === GameStatus.PLAYING) {
      gameLoopRef.current = window.setInterval(moveSnake, speed);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [status, moveSnake, speed]);

  // Input Handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status === GameStatus.IDLE || status === GameStatus.GAME_OVER) {
        if (e.key === 'Enter' || e.key === ' ') resetGame();
        return;
      }

      if (e.key === 'p' || e.key === 'P') {
        setStatus(prev => prev === GameStatus.PLAYING ? GameStatus.PAUSED : GameStatus.PLAYING);
        return;
      }

      if (status !== GameStatus.PLAYING) return;

      switch (e.key) {
        case 'ArrowUp':
          if (direction !== Direction.DOWN) setNextDirection(Direction.UP);
          break;
        case 'ArrowDown':
          if (direction !== Direction.UP) setNextDirection(Direction.DOWN);
          break;
        case 'ArrowLeft':
          if (direction !== Direction.RIGHT) setNextDirection(Direction.LEFT);
          break;
        case 'ArrowRight':
          if (direction !== Direction.LEFT) setNextDirection(Direction.RIGHT);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, direction]);

  // Mobile Controls
  const handleTouchControl = (dir: Direction) => {
    // Basic vibration feedback
    if (navigator.vibrate) navigator.vibrate(10);
    
    if (status !== GameStatus.PLAYING) return;
    
    if (dir === Direction.UP && direction !== Direction.DOWN) setNextDirection(Direction.UP);
    if (dir === Direction.DOWN && direction !== Direction.UP) setNextDirection(Direction.DOWN);
    if (dir === Direction.LEFT && direction !== Direction.RIGHT) setNextDirection(Direction.LEFT);
    if (dir === Direction.RIGHT && direction !== Direction.LEFT) setNextDirection(Direction.RIGHT);
  };

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 transition-colors duration-1000 ease-in-out"
      style={{
        background: `linear-gradient(to bottom right, ${theme.colors.backgroundFrom}, ${theme.colors.backgroundTo})`,
        color: theme.colors.text
      }}
    >
      <div className="flex flex-col items-center w-full max-w-lg z-10">
        <header className="mb-6 text-center">
          <h1 
            className="text-4xl md:text-5xl font-bold tracking-tighter mb-2"
            style={{ 
              textShadow: `0 0 20px ${theme.colors.snakeGlow}`,
              color: theme.colors.snakeHead 
            }}
          >
            DreamSnake
          </h1>
          <p className="opacity-80 text-sm font-light tracking-widest uppercase">{theme.description}</p>
        </header>

        <div className="flex justify-between w-full max-w-[400px] mb-4 px-4 font-mono text-lg font-bold">
          <div className="flex flex-col items-center">
            <span className="text-xs opacity-60 uppercase">Score</span>
            <span>{score}</span>
          </div>
          
           <div className="flex flex-col items-center">
             <button
               onClick={() => {
                  if (status === GameStatus.PLAYING) setStatus(GameStatus.PAUSED);
                  else if (status === GameStatus.PAUSED) setStatus(GameStatus.PLAYING);
                  else resetGame();
               }}
               className="px-6 py-1 rounded-full text-sm uppercase tracking-wide border transition-all hover:bg-white/10 active:scale-95"
               style={{ 
                 borderColor: theme.colors.text, 
                 boxShadow: `0 0 10px ${theme.colors.gridLines}` 
               }}
             >
               {status === GameStatus.PLAYING ? 'Pause' : status === GameStatus.PAUSED ? 'Resume' : 'Start'}
             </button>
           </div>

          <div className="flex flex-col items-center">
            <span className="text-xs opacity-60 uppercase">Best</span>
            <span>{highScore}</span>
          </div>
        </div>

        <GameBoard 
          snake={snake} 
          food={food} 
          theme={theme} 
          status={status}
        />

        {/* Mobile Controls */}
        <div className="mt-8 grid grid-cols-3 gap-2 md:hidden">
          <div />
          <button 
            className="w-16 h-16 rounded-full bg-white/5 backdrop-blur-md border border-white/10 active:bg-white/20 flex items-center justify-center shadow-lg"
            onTouchStart={(e) => { e.preventDefault(); handleTouchControl(Direction.UP); }}
            onClick={() => handleTouchControl(Direction.UP)}
          >
            <svg className="w-6 h-6 rotate-0" fill="currentColor" viewBox="0 0 20 20"><path d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"/></svg>
          </button>
          <div />
          
          <button 
            className="w-16 h-16 rounded-full bg-white/5 backdrop-blur-md border border-white/10 active:bg-white/20 flex items-center justify-center shadow-lg"
            onTouchStart={(e) => { e.preventDefault(); handleTouchControl(Direction.LEFT); }}
            onClick={() => handleTouchControl(Direction.LEFT)}
          >
            <svg className="w-6 h-6 -rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"/></svg>
          </button>
          
          <button 
            className="w-16 h-16 rounded-full bg-white/5 backdrop-blur-md border border-white/10 active:bg-white/20 flex items-center justify-center shadow-lg"
            onTouchStart={(e) => { e.preventDefault(); handleTouchControl(Direction.DOWN); }}
            onClick={() => handleTouchControl(Direction.DOWN)}
          >
            <svg className="w-6 h-6 rotate-180" fill="currentColor" viewBox="0 0 20 20"><path d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"/></svg>
          </button>
          
          <button 
            className="w-16 h-16 rounded-full bg-white/5 backdrop-blur-md border border-white/10 active:bg-white/20 flex items-center justify-center shadow-lg"
            onTouchStart={(e) => { e.preventDefault(); handleTouchControl(Direction.RIGHT); }}
            onClick={() => handleTouchControl(Direction.RIGHT)}
          >
            <svg className="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"/></svg>
          </button>
        </div>

        <div className="mt-8 w-full">
          <ThemeGenerator onThemeSelect={setTheme} currentTheme={theme} />
        </div>
      </div>
    </div>
  );
};

export default App;