import { Theme } from '../types/game';

export interface TokenColors {
  player1: string;
  player2: string;
  border: string;
  empty: string;
}

export const getTokenColors = (theme: Theme): TokenColors => ({
  player1: '#FFD700', // Yellow
  player2: '#FF0000', // Red
  border: theme === 'light' ? '#E5E7EB' : '#4B5563',
  empty: theme === 'light' ? '#FFFFFF' : '#000000',
});