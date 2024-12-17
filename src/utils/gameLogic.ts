import { Board, Player } from '../types/game';

export const createEmptyBoard = (): Board => {
  return Array(6).fill(null).map(() => Array(7).fill(null));
};

export const checkWin = (board: Board, row: number, col: number, player: Player): boolean => {
  const directions = [
    [0, 1],   // horizontal
    [1, 0],   // vertical
    [1, 1],   // diagonal right
    [1, -1],  // diagonal left
  ];

  return directions.some(([dx, dy]) => {
    let count = 1;
    
    // Check forward direction
    for (let i = 1; i < 4; i++) {
      const newRow = row + (dx * i);
      const newCol = col + (dy * i);
      if (!isValidPosition(newRow, newCol) || board[newRow][newCol] !== player) break;
      count++;
    }

    // Check backward direction
    for (let i = 1; i < 4; i++) {
      const newRow = row - (dx * i);
      const newCol = col - (dy * i);
      if (!isValidPosition(newRow, newCol) || board[newRow][newCol] !== player) break;
      count++;
    }

    return count >= 4;
  });
};

export const isValidPosition = (row: number, col: number): boolean => {
  return row >= 0 && row < 6 && col >= 0 && col < 7;
};

export const findLowestEmptyRow = (board: Board, col: number): number => {
  for (let row = 5; row >= 0; row--) {
    if (!board[row][col]) return row;
  }
  return -1;
};

export const getAIMove = (board: Board): number => {
  // Simple AI: Find first available column
  for (let col = 0; col < 7; col++) {
    if (board[0][col] === null) return col;
  }
  return -1;
};