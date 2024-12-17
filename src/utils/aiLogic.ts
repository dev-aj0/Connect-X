import { Board, Player } from '../types/game';
import { checkWin, findLowestEmptyRow, isValidPosition } from './gameLogic';

// Scoring for different patterns
const SCORES = {
  WIN: 100000,
  THREE_IN_ROW: 100,
  TWO_IN_ROW: 10,
  CENTER_CONTROL: 3,
};

// Evaluate a window of 4 positions
const evaluateWindow = (window: (Player | null)[], player: Player): number => {
  const opponent = player === 1 ? 2 : 1;
  let score = 0;

  const playerCount = window.filter(cell => cell === player).length;
  const emptyCount = window.filter(cell => cell === null).length;
  const opponentCount = window.filter(cell => cell === opponent).length;

  if (playerCount === 4) return SCORES.WIN;
  if (playerCount === 3 && emptyCount === 1) score += SCORES.THREE_IN_ROW;
  if (playerCount === 2 && emptyCount === 2) score += SCORES.TWO_IN_ROW;
  if (opponentCount === 3 && emptyCount === 1) score -= SCORES.THREE_IN_ROW * 1.5; // Prioritize blocking opponent wins

  return score;
};

// Get all possible windows of 4 positions
const getAllWindows = (board: Board, row: number, col: number): (Player | null)[][] => {
  const windows: (Player | null)[][] = [];
  const directions = [
    [0, 1], // horizontal
    [1, 0], // vertical
    [1, 1], // diagonal right
    [1, -1], // diagonal left
  ];

  directions.forEach(([dx, dy]) => {
    for (let i = -3; i <= 0; i++) {
      const window: (Player | null)[] = [];
      for (let j = 0; j < 4; j++) {
        const newRow = row + (dx * (i + j));
        const newCol = col + (dy * (i + j));
        if (isValidPosition(newRow, newCol)) {
          window.push(board[newRow][newCol]);
        }
      }
      if (window.length === 4) {
        windows.push(window);
      }
    }
  });

  return windows;
};

// Evaluate board position
const evaluatePosition = (board: Board, player: Player): number => {
  let score = 0;

  // Evaluate all positions
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 7; col++) {
      const windows = getAllWindows(board, row, col);
      windows.forEach(window => {
        score += evaluateWindow(window, player);
      });
    }
  }

  // Bonus for center control
  for (let row = 0; row < 6; row++) {
    if (board[row][3] === player) {
      score += SCORES.CENTER_CONTROL;
    }
  }

  return score;
};

// Minimax algorithm with alpha-beta pruning
const minimax = (
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  maximizingPlayer: boolean,
  player: Player
): { score: number; column?: number } => {
  const validMoves = getValidMoves(board);
  
  // Check terminal states
  if (depth === 0 || validMoves.length === 0) {
    return { score: evaluatePosition(board, player) };
  }

  if (maximizingPlayer) {
    let maxScore = -Infinity;
    let bestColumn = validMoves[0];
    
    for (const col of validMoves) {
      const row = findLowestEmptyRow(board, col);
      const newBoard = board.map(row => [...row]);
      newBoard[row][col] = player;
      
      const score = minimax(
        newBoard,
        depth - 1,
        alpha,
        beta,
        false,
        player
      ).score;
      
      if (score > maxScore) {
        maxScore = score;
        bestColumn = col;
      }
      alpha = Math.max(alpha, score);
      if (beta <= alpha) break;
    }
    
    return { score: maxScore, column: bestColumn };
  } else {
    let minScore = Infinity;
    let bestColumn = validMoves[0];
    const opponent = player === 1 ? 2 : 1;
    
    for (const col of validMoves) {
      const row = findLowestEmptyRow(board, col);
      const newBoard = board.map(row => [...row]);
      newBoard[row][col] = opponent;
      
      const score = minimax(
        newBoard,
        depth - 1,
        alpha,
        beta,
        true,
        player
      ).score;
      
      if (score < minScore) {
        minScore = score;
        bestColumn = col;
      }
      beta = Math.min(beta, score);
      if (beta <= alpha) break;
    }
    
    return { score: minScore, column: bestColumn };
  }
};

const getValidMoves = (board: Board): number[] => {
  const validMoves: number[] = [];
  for (let col = 0; col < 7; col++) {
    if (board[0][col] === null) {
      validMoves.push(col);
    }
  }
  return validMoves;
};

// Make a random valid move (for easy mode)
const makeRandomMove = (board: Board): number => {
  const validMoves = getValidMoves(board);
  return validMoves[Math.floor(Math.random() * validMoves.length)];
};

// Make a mistake occasionally (for medium mode)
const makeMediumMove = (board: Board, player: Player): number => {
  // 30% chance to make a random move
  if (Math.random() < 0.3) {
    return makeRandomMove(board);
  }
  
  // Otherwise make a smart move with reduced depth
  const result = minimax(board, 3, -Infinity, Infinity, true, player);
  return result.column ?? 0;
};

export const getAIMove = (board: Board, difficulty: string, player: Player = 2): number => {
  switch (difficulty) {
    case 'easy':
      return makeRandomMove(board);
    case 'medium':
      return makeMediumMove(board, player);
    case 'hard':
      // Use full minimax with greater depth
      const result = minimax(board, 6, -Infinity, Infinity, true, player);
      return result.column ?? 0;
    default:
      return makeRandomMove(board);
  }
};