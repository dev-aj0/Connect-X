import React from 'react';
import { getTokenColors } from '../utils/colors';
import { GameMode, Theme, AIDifficulty } from '../types/game';

interface GameStatsProps {
  player1Wins: number;
  player2Wins: number;
  theme: Theme;
  gameMode: GameMode;
  aiDifficulty: AIDifficulty;
}

export const GameStats: React.FC<GameStatsProps> = ({ 
  player1Wins, 
  player2Wins, 
  theme,
  gameMode,
  aiDifficulty
}) => {
  const colors = getTokenColors(theme);
  const textColor = theme === 'light' ? 'text-gray-800' : 'text-gray-200';
  
  return (
    <div className={`flex justify-center gap-8 mb-6 ${textColor}`}>
      <div className="text-center">
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded-full inline-block"
            style={{ backgroundColor: colors.player1 }}
          />
          <h3 className="font-bold">Player 1</h3>
        </div>
        <p className="text-2xl">{player1Wins}</p>
      </div>
      <div className="text-center">
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded-full inline-block"
            style={{ backgroundColor: colors.player2 }}
          />
          <h3 className="font-bold">
            {gameMode === 'ai' ? `AI (${aiDifficulty})` : 'Player 2'}
          </h3>
        </div>
        <p className="text-2xl">{player2Wins}</p>
      </div>
    </div>
  );
};