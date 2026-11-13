import React from 'react';
import { usePomodoroStore } from '../stores/usePomodoroStore';
import { useUIStore } from '../stores/useUIStore';

export const ZenModeView: React.FC = () => {
  const { timeLeft, mode, focusDuration, shortBreakDuration, longBreakDuration, isRunning, toggleTimer } = usePomodoroStore();
  const { isZenMode, toggleZenMode } = useUIStore();

  if (!isZenMode) return null;

  const totalDuration =
    (mode === 'focus' ? focusDuration : mode === 'shortBreak' ? shortBreakDuration : longBreakDuration) * 60;
  const progressPercent = Math.max(0, Math.min(100, ((totalDuration - timeLeft) / totalDuration) * 100));

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <div
      onClick={toggleTimer}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer select-none animate-in fade-in duration-700"
    >
      {/* Solitary Centered Minimal Pomodoro Clock */}
      <div className="flex flex-col items-center text-center">
        {/* Giant Ultra-Thin Numerals */}
        <div className="font-display text-[7rem] sm:text-[10rem] md:text-[13rem] font-extralight tracking-tighter text-white/80 leading-none drop-shadow-2xl hover:text-white/95 transition-colors">
          {minutes}:{seconds}
        </div>

        {/* Small uppercase label */}
        <div className="text-xs uppercase tracking-[0.3em] text-white/50 font-light mt-4">
          {mode === 'focus' ? 'Focus' : 'Break'} • {isRunning ? 'Running' : 'Paused'}
        </div>
      </div>

      {/* Razor-thin Ambient Progress Line at bottom edge */}
      <div className="fixed bottom-0 left-0 w-full h-[3px] bg-white/5 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-container/40 via-primary/60 to-secondary/50 transition-all duration-1000 ease-linear"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Exit Hint */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          toggleZenMode();
        }}
        className="fixed bottom-6 text-[11px] font-light tracking-wider text-white/25 hover:text-white/70 transition-colors px-3 py-1 rounded-full hover:bg-white/5"
      >
        Press [Z] or [ESC] or click here to exit Zen Mode
      </div>
    </div>
  );
};

