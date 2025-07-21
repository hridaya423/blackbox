"use client";

import { useEffect, useState } from "react";

interface IntroScreenProps {
  onStartGame: () => void;
  puzzleNumber: number;
}

const IntroScreen = ({ onStartGame, puzzleNumber }: IntroScreenProps) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
    
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        onStartGame();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onStartGame]);

  return (
    <div className="h-screen flex items-center justify-center px-6">
      <div 
        className={`max-w-2xl mx-auto text-center transition-all duration-500 ${
          loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="font-mono text-sm text-zinc-400 uppercase tracking-wider">
              System Ready
            </span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-light tracking-tight mb-6">
            <span className="bg-gradient-to-r from-black-500 to-gray-400 bg-clip-text text-transparent">Blackbox</span>
          </h1>
          
          <div className="flex items-center justify-center mb-8">
            <div className="w-8 h-px bg-zinc-700"></div>
            <div className="w-2 h-2 bg-zinc-600 rounded-full mx-4"></div>
            <div className="w-8 h-px bg-zinc-700"></div>
          </div>
          
          <div className="space-y-2">
            <p className="text-xl text-zinc-300 font-light">
              Puzzle #{puzzleNumber.toString().padStart(3, '0')}
            </p>
            <p className="text-zinc-500 max-w-md mx-auto leading-relaxed">
              Discover the hidden function through systematic experimentation
            </p>
          </div>
        </div>

        <div className="space-y-6 flex flex-col items-center">
          <button
            onClick={onStartGame}
            className="bg-gray-500 hover:bg-gray-600 text-white border-none rounded-lg px-10 py-4 text-lg font-semibold flex items-center justify-center gap-2 min-h-[50px] transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0"
          >
            Begin Analysis
          </button>
          
          <p className="font-mono text-xs text-zinc-600">
            Press Enter or Space to continue
          </p>
        </div>
      </div>
    </div>
  );
};

export default IntroScreen;