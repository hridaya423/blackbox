"use client";

import { useState, useEffect } from "react";
import AnalysisTerminal from "./AnalysisTerminal";

const pseudoRandom = (seed: number) => {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const getDailyEquation = () => {
  const date = new Date();
  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  const a = Math.floor(pseudoRandom(seed) * 10) + 1;
  const b = Math.floor(pseudoRandom(seed * 2) * 10) + 1;
  return { a, b };
};

const getPuzzleNumber = () => {
  const startDate = new Date('2025-07-20T00:00:00Z');
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);
  const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1;
};

interface GameProps {
  onBackToIntro?: () => void;
  onPuzzleNumberChange?: (num: number) => void;
}

const Game = ({ onBackToIntro, onPuzzleNumberChange }: GameProps) => {
  const [equation, setEquation] = useState({ a: 0, b: 0 });
  const [inputValue, setInputValue] = useState("");
  const [history, setHistory] = useState<{ input: number; output: number }[]>([]);
  const [guess, setGuess] = useState("");
  const [testsRemaining, setTestsRemaining] = useState(6);
  const [guessMade, setGuessMade] = useState(false);
  const [message, setMessage] = useState("");
  const [isSolved, setIsSolved] = useState(false);
  const [puzzleNumber, setPuzzleNumber] = useState(0);
  const [pulseBox, setPulseBox] = useState(false);

  useEffect(() => {
    const { a, b } = getDailyEquation();
    const puzzleNum = getPuzzleNumber();
    setEquation({ a, b });
    setPuzzleNumber(puzzleNum);
    if (onPuzzleNumberChange) {
      onPuzzleNumberChange(puzzleNum);
    }
  }, [onPuzzleNumberChange]);

  const handleTest = () => {
    if (isSolved || testsRemaining === 0) return;

    const num = parseInt(inputValue);

    if (!isNaN(num)) {
      const output = equation.a * num + equation.b;
      setHistory([...history, { input: num, output }]);
      setInputValue("");
      setTestsRemaining(testsRemaining - 1);
      setPulseBox(true);
      setTimeout(() => setPulseBox(false), 100);
    }
  };

  const handleGuess = () => {
    if (isSolved || guessMade) return;

    setGuessMade(true);
    const { a, b } = equation;
    const correctEquation = `x * ${a} + ${b}`;

    if (guess.replace(/\s+/g, "") === correctEquation.replace(/\s+/g, "")) {
      setMessage(`Correct! The function was f(x) = ${a}x + ${b}`);
      setIsSolved(true);
    } else {
      setMessage(`Incorrect. The function was f(x) = ${a}x + ${b}`);
      setIsSolved(true);
    }
  };

  const handleShare = () => {
    const testsTaken = history.length;
    const date = new Date();
    const dateString = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const shareText = `BLACK BOX #${puzzleNumber} • ${testsTaken} ${testsTaken === 1 ? 'test' : 'tests'} • ${dateString}`;
    navigator.clipboard.writeText(shareText).then(() => {
      alert("Results copied to clipboard!");
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (e.currentTarget.id === 'guess') {
        handleGuess();
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">

      
      <div className="flex-1 flex items-center justify-center px-8 py-8">
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
          
          <div className="order-2 lg:order-1">
            <AnalysisTerminal 
              isActive={!isSolved} 
              pulseOnTest={pulseBox}
              history={history}
              currentInput={inputValue}
              isProcessing={false}
              onInputChange={setInputValue}
              onTest={handleTest}
              testsRemaining={testsRemaining}
            />
          </div>

          
          <div className="order-1 lg:order-2 text-center flex flex-col items-center justify-center">
            <div className="mb-8">
              <h1 className="text-3xl lg:text-4xl font-light text-zinc-100 mb-2">
                Puzzle #{puzzleNumber.toString().padStart(3, '0')}
              </h1>
              <p className="font-mono text-sm text-zinc-500 mb-8">
                Find f(x) = ax + b
              </p>
              
              
              <div className="flex items-center justify-center mb-8">
                <div className="w-8 h-px bg-zinc-700"></div>
                <div className="w-2 h-2 bg-zinc-600 rounded-full mx-4"></div>
                <div className="w-8 h-px bg-zinc-700"></div>
              </div>
            </div>
          </div>

          
          <div className="order-3 space-y-8">
            <div className="flex items-center justify-center gap-3">
              <h2 className="text-xl font-medium text-zinc-100">Submit Solution</h2>
            </div>
            
            <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-10 shadow-lg">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="guess" className="block font-mono text-sm text-zinc-400 mb-3">
                      Your Hypothesis
                    </label>
                    <input
                      id="guess"
                      type="text"
                      value={guess}
                      onChange={(e) => setGuess(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="bg-zinc-800 border border-zinc-600 text-zinc-100 rounded-lg px-4 py-3 text-base font-medium w-full min-h-[48px] focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none placeholder-zinc-500"
                      disabled={isSolved || guessMade}
                      placeholder="x * a + b"
                    />
                  </div>
                  
                  <button
                    onClick={handleGuess}
                    disabled={isSolved || guessMade}
                    className="bg-gray-500 hover:bg-gray-600 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed text-white border-none rounded-lg px-8 py-4 font-semibold flex items-center justify-center gap-2 min-h-[50px] transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 w-full"
                  >
                    Submit
                  </button>
              </div>
            </div>

            {message && (
              <div className={`bg-zinc-900 border rounded-xl p-10 shadow-lg ${
                  isSolved && message.includes('Correct') 
                    ? 'border-green-500/30 bg-green-500/5' 
                    : 'border-red-500/30 bg-red-500/5'
                }`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-2 h-2 rounded-full ${
                      message.includes('Correct') ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <h3 className="text-xl font-medium">Result</h3>
                  </div>
                  
                  <p className={`font-mono text-base mb-6 leading-relaxed ${
                    message.includes('Correct') ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {message}
                  </p>
                  
                {isSolved && (
                  <button
                    onClick={handleShare}
                    className="bg-green-500 hover:bg-green-600 text-white border-none rounded-lg px-8 py-4 font-semibold flex items-center justify-center gap-2 min-h-[50px] transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 w-full"
                  >
                    Share Result
                  </button>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Game;