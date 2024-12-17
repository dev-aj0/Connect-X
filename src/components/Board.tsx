import React from 'react';
import { Cell } from './Cell';
import { Board as BoardType } from '../types/game';

interface BoardProps {
  board: BoardType;
  onColumnClick: (col: number) => void;
  theme: 'light' | 'dark';
  lastMove?: { row: number; col: number } | null;
}

export const Board: React.FC<BoardProps> = ({ 
  board, 
  onColumnClick, 
  theme,
  lastMove 
}) => {
  return (
    <div 
      className="inline-block p-4 rounded-lg shadow-lg" 
      style={{ 
        backgroundColor: theme === 'light' ? '#f3f4f6' : '#000000',
        boxShadow: theme === 'light' 
          ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
          : '0 10px 15px -3px rgba(255, 255, 255, 0.05)'
      }}
    >
      <div className="grid grid-cols-7 gap-2">
        {board[0].map((_, colIndex) => (
          <button
            key={colIndex}
            onClick={() => onColumnClick(colIndex)}
            className={`hover:bg-opacity-10 hover:bg-gray-500 rounded-full p-1 transition-colors ${
              theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-gray-800'
            }`}
          >
            {board.map((row, rowIndex) => (
              <div key={rowIndex} className="mb-2">
                <Cell 
                  value={board[rowIndex][colIndex]} 
                  theme={theme}
                  row={rowIndex}
                  isNew={lastMove?.row === rowIndex && lastMove?.col === colIndex}
                />
              </div>
            ))}
          </button>
        ))}
      </div>
    </div>
  );
};