import React from 'react';
import { Cell as CellType } from '../types/game';
import { getTokenColors } from '../utils/colors';

interface CellProps {
  value: CellType;
  theme: 'light' | 'dark';
  row: number;
  isNew?: boolean;
}

export const Cell: React.FC<CellProps> = ({ value, theme, row, isNew }) => {
  const colors = getTokenColors(theme);
  
  const baseClasses = "w-12 h-12 rounded-full transition-all duration-300";
  const borderClass = `border-2 border-${theme === 'light' ? 'gray-200' : 'gray-700'}`;
  
  const getBackgroundColor = () => {
    if (!value) return colors.empty;
    return value === 1 ? colors.player1 : colors.player2;
  };

  const animationClasses = isNew ? `animate-drop-${row}` : '';

  return (
    <div 
      className={`${baseClasses} ${borderClass} ${animationClasses}`}
      style={{
        backgroundColor: getBackgroundColor(),
        borderColor: colors.border,
      }}
    />
  );
};