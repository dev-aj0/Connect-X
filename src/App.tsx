import React, { useState, useCallback, useEffect } from 'react';
import { Board } from './components/Board';
import { GameStats } from './components/GameStats';
import { GameControls } from './components/GameControls';
import { Board as BoardType, GameMode, Theme, AIDifficulty } from './types/game';
import { createEmptyBoard, checkWin, findLowestEmptyRow } from './utils/gameLogic';
import { getAIMove } from './utils/aiLogic';

function App() {
  const [board, setBoard] = useState<BoardType>(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [gameMode, setGameMode] = useState<GameMode>('pvp');
  const [aiDifficulty, setAIDifficulty] = useState<AIDifficulty>('medium');
  const [theme, setTheme] = useState<Theme>('light');
  const [player1Wins, setPlayer1Wins] = useState(0);
  const [player2Wins, setPlayer2Wins] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [lastMove, setLastMove] = useState<{ row: number; col: number } | null>(null);

  const handleMove = useCallback((col: number) => {
    if (gameOver) return;
    
    const row = findLowestEmptyRow(board, col);
    if (row === -1) return;

    const newBoard = board.map(row => [...row]);
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);
    setLastMove({ row, col });

    if (checkWin(newBoard, row, col, currentPlayer)) {
      if (currentPlayer === 1) setPlayer1Wins(prev => prev + 1);
      else setPlayer2Wins(prev => prev + 1);
      setGameOver(true);
      return;
    }

    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
  }, [board, currentPlayer, gameOver]);

  useEffect(() => {
    if (gameMode === 'ai' && currentPlayer === 2 && !gameOver) {
      const timer = setTimeout(() => {
        const aiCol = getAIMove(board, aiDifficulty, 2);
        if (aiCol !== -1) handleMove(aiCol);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, gameMode, board, gameOver, handleMove, aiDifficulty]);

  const resetGame = () => {
    setBoard(createEmptyBoard());
    setCurrentPlayer(1);
    setGameOver(false);
    setLastMove(null);
  };

  const resetScores = () => {
    setPlayer1Wins(0);
    setPlayer2Wins(0);
    resetGame();
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleGameMode = () => {
    setGameMode(gameMode === 'ai' ? 'pvp' : 'ai');
    resetGame();
  };

  const handleDifficultyChange = (difficulty: AIDifficulty) => {
    setAIDifficulty(difficulty);
    resetGame();
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'light' ? 'bg-gray-100' : 'bg-black'
    }`}>
      <div className="container mx-auto px-4 py-8">
        <GameControls
          theme={theme}
          gameMode={gameMode}
          aiDifficulty={aiDifficulty}
          onThemeToggle={toggleTheme}
          onGameModeToggle={toggleGameMode}
          onDifficultyChange={handleDifficultyChange}
          onReset={resetScores}
        />

        <div className="text-center">
          <GameStats
            player1Wins={player1Wins}
            player2Wins={player2Wins}
            theme={theme}
            gameMode={gameMode}
            aiDifficulty={aiDifficulty}
          />

          <Board
            board={board}
            onColumnClick={handleMove}
            theme={theme}
            lastMove={lastMove}
          />

          {gameOver && (
            <div className="mt-6">
              <p className={`text-xl mb-4 ${
                theme === 'light' ? 'text-gray-800' : 'text-white'
              }`}>
                {`${currentPlayer === 1 ? 'Player 1' : (gameMode === 'ai' ? 'AI' : 'Player 2')} wins!`}
              </p>
              <button
                onClick={resetGame}
                className={`px-4 py-2 rounded ${
                  theme === 'light'
                    ? 'bg-black text-white hover:bg-gray-800'
                    : 'bg-white text-black hover:bg-gray-100'
                } transition-colors`}
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;