"use client";

import { useState } from "react";
import Game from "./components/Game";
import IntroScreen from "./components/IntroScreen";

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);
  const [puzzleNumber, setPuzzleNumber] = useState(1);

  const handleStartGame = () => {
    setGameStarted(true);
  };

  const handleBackToIntro = () => {
    setGameStarted(false);
  };

  return (
    <main className="min-h-screen overflow-hidden">
      <div 
        className={`transition-all duration-500 ease-out ${
          !gameStarted ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ position: !gameStarted ? 'static' : 'absolute', width: '100%', height: '100%' }}
      >
        <IntroScreen onStartGame={handleStartGame} puzzleNumber={puzzleNumber} />
      </div>
      
      <div 
        className={`transition-all duration-500 ease-out ${
          gameStarted ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ position: gameStarted ? 'static' : 'absolute', width: '100%', height: '100%' }}
      >
        <Game onBackToIntro={handleBackToIntro} onPuzzleNumberChange={setPuzzleNumber} />
      </div>
    </main>
  );
}