
import React, { useState, useEffect, useRef } from 'react';

interface FocusShieldProps {
  durationMinutes: number;
  tip: string;
  onComplete: () => void;
}

const FocusShield: React.FC<FocusShieldProps> = ({ durationMinutes, tip, onComplete }) => {
  const [secondsLeft, setSecondsLeft] = useState(durationMinutes * 60);
  const [unlockProgress, setUnlockProgress] = useState(0);
  const unlockInterval = useRef<any>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startUnlock = () => {
    unlockInterval.current = setInterval(() => {
      setUnlockProgress((prev) => {
        if (prev >= 100) {
          clearInterval(unlockInterval.current);
          onComplete();
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  const stopUnlock = () => {
    clearInterval(unlockInterval.current);
    setUnlockProgress(0);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center p-6 text-white overflow-hidden">
      {/* Background Pulse */}
      <div className="absolute inset-0 bg-indigo-600/10 animate-pulse pointer-events-none"></div>
      
      <div className="relative z-10 text-center space-y-8 max-w-md w-full">
        <div className="inline-block p-4 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-xl mb-4">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-indigo-400">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
        </div>

        <div>
          <h1 className="text-6xl font-black tracking-tighter mb-2 font-mono">
            {formatTime(secondsLeft)}
          </h1>
          <p className="text-indigo-400 font-bold uppercase tracking-[0.2em] text-xs">
            Refocus Mode Active
          </p>
        </div>

        <div className="bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-md">
          <p className="text-lg italic font-medium leading-relaxed text-slate-200">
            "{tip}"
          </p>
        </div>

        <div className="pt-12">
          <button
            onMouseDown={startUnlock}
            onMouseUp={stopUnlock}
            onMouseLeave={stopUnlock}
            onTouchStart={startUnlock}
            onTouchEnd={stopUnlock}
            className="relative w-full py-5 rounded-2xl bg-white/5 border border-white/10 font-bold overflow-hidden transition-all active:scale-95 select-none"
          >
            <div 
              className="absolute inset-y-0 left-0 bg-rose-600/40 transition-all duration-75" 
              style={{ width: `${unlockProgress}%` }}
            ></div>
            <span className="relative z-20 text-slate-400">
              {unlockProgress > 0 ? 'Breaking Focus...' : 'Hold to Emergency Unlock'}
            </span>
          </button>
          <p className="text-[10px] text-slate-500 mt-4 uppercase tracking-widest">
            Unlock takes 3 seconds of continuous holding
          </p>
        </div>
      </div>
    </div>
  );
};

export default FocusShield;
