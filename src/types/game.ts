export type Player = 1 | 2;
export type Cell = Player | null;
export type Board = Cell[][];
export type GameMode = 'ai' | 'pvp';
export type Theme = 'light' | 'dark';
export type AIDifficulty = 'easy' | 'medium' | 'hard';