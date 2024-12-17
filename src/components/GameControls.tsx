import React from 'react';
import { Sun, Moon, Bot, Users, RotateCcw } from 'lucide-react';
import { GameMode, Theme, AIDifficulty } from '../types/game';

interface GameControlsProps {
  theme: Theme;
  gameMode: GameMode;
  aiDifficulty: AIDifficulty;
  onThemeToggle: () => void;
  onGameModeToggle: () => void;
  onDifficultyChange: (difficulty: AIDifficulty) => void;
  onReset: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  theme,
  gameMode,
  aiDifficulty,
  onThemeToggle,
  onGameModeToggle,
  onDifficultyChange,
  onReset,
}) => {
  const buttonClass = `p-2 rounded-full transition-colors duration-200 ${
    theme === 'light' ? 'bg-white text-gray-800' : 'bg-black text-white'
  } shadow-md hover:scale-110`;

  const selectClass = `
    px-3 py-1 rounded-lg transition-colors duration-200
    ${theme === 'light' 
      ? 'bg-white text-gray-800 border-gray-200' 
      : 'bg-black text-white border-gray-700'
    }
    border shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-50
    ${theme === 'light' ? 'focus:ring-gray-300' : 'focus:ring-gray-600'}
  `;

  return (
    <div className="flex justify-end items-center gap-4 mb-8">
      <button onClick={onReset} className={buttonClass} title="Reset Game">
        <RotateCcw className="w-5 h-5" />
      </button>
      
      {gameMode === 'ai' && (
        <select
          value={aiDifficulty}
          onChange={(e) => onDifficultyChange(e.target.value as AIDifficulty)}
          className={selectClass}
          title="AI Difficulty"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      )}

      <button onClick={onGameModeToggle} className={buttonClass} title="Toggle Game Mode">
        {gameMode === 'ai' ? (
          <Bot className="w-5 h-5" />
        ) : (
          <Users className="w-5 h-5" />
        )}
      </button>

      <button onClick={onThemeToggle} className={buttonClass} title="Toggle Theme">
        {theme === 'light' ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </button>
    </div>
  );
};