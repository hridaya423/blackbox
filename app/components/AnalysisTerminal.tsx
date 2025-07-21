"use client";

import { useState, useEffect, useRef } from "react";

interface AnalysisTerminalProps {
  isActive: boolean;
  pulseOnTest?: boolean;
  history: { input: number; output: number }[];
  currentInput?: string;
  isProcessing?: boolean;
  onInputChange?: (value: string) => void;
  onTest?: () => void;
  testsRemaining?: number;
}

const AnalysisTerminal = ({ 
  isActive, 
  pulseOnTest, 
  history, 
  currentInput,
  onInputChange,
  onTest,
  testsRemaining = 6
}: AnalysisTerminalProps) => {
  const [isPulsing, setIsPulsing] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pulseOnTest) {
      setIsPulsing(true);
      const timer = setTimeout(() => setIsPulsing(false), 600);
      return () => clearTimeout(timer);
    }
  }, [pulseOnTest]);

  
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <div className="w-full">
      <div className={`relative ${isPulsing ? 'animate-fade-in' : ''}`}>
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl w-full shadow-lg" style={{ minHeight: '360px' }}>
          
          <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-700">
           
            <span className="font-mono text-sm text-zinc-500 ml-2">
              blackbox.exe
            </span>
            <div className="flex-1" />
            <div className={`w-2 h-2 rounded-full bg-green-500 ${isActive ? 'animate-pulse' : 'opacity-30'}`} />
          </div>

          
          <div className="p-8 md:p-10">
            <div className="flex items-center justify-between h-12 md:h-16 mb-6 md:mb-8">
              
              <div className="flex flex-col items-center space-y-3 flex-1">
                <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider">INPUT</div>
                <input
                  type="number"
                  value={currentInput || ''}
                  onChange={(e) => onInputChange?.(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      onTest?.();
                    }
                  }}
                  className="w-20 h-10 bg-zinc-800 border-2 border-blue-500 rounded text-center font-mono text-sm text-blue-400 placeholder-blue-500/50 focus:border-blue-400 focus:outline-none"
                  placeholder="?"
                  disabled={!isActive || testsRemaining === 0}
                />
              </div>

              
              <div className="flex items-center space-x-2 flex-1 justify-center">
                <div className="w-12 h-px bg-gradient-to-r from-zinc-600 to-zinc-400" />
                <div className="font-mono text-zinc-400 text-base font-medium">f(x)</div>
                <div className="w-12 h-px bg-gradient-to-r from-zinc-400 to-zinc-600" />
              </div>

              
              <div className="flex flex-col items-center space-y-3 flex-1">
                <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider">OUTPUT</div>
                <div className="w-20 h-10 rounded border-2 border-amber-500 bg-amber-500/10 flex items-center justify-center">
                  <span className="font-mono text-sm text-amber-400">
                    {history.length > 0 ? history[history.length - 1].output : '?'}
                  </span>
                </div>
              </div>
            </div>

            
            <div className="bg-zinc-900/50 rounded-lg border border-zinc-700">
              <div className="px-4 py-2 border-b border-zinc-700">
                <span className="font-mono text-xs text-zinc-500">Test History</span>
              </div>
              <div ref={terminalRef} className="p-6 h-40 md:h-48 overflow-y-auto space-y-2 font-mono text-sm">
                {history.length === 0 ? (
                  <div className="text-zinc-500 italic">No tests performed yet</div>
                ) : (
                  history.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <span className="text-blue-400">{item.input}</span>
                      <span className="text-zinc-500">→</span>
                      <span className="text-amber-400">{item.output}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-center mt-6 gap-4">
              <span className={`font-mono text-sm ${isActive ? 'text-green-500' : 'text-zinc-500'}`}>
                {isActive ? 'READY' : 'IDLE'}
              </span>
              <span className="font-mono text-xs text-zinc-600">•</span>
              <span className="font-mono text-xs text-zinc-600">
                {testsRemaining} tests remaining
              </span>
            </div>
          </div>

          
          {isPulsing && (
            <div className="absolute inset-0 bg-green-500/10 rounded-xl border border-green-500/20 pointer-events-none" />
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisTerminal;