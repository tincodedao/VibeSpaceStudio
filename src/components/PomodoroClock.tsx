import React, { useEffect } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Music } from 'lucide-react';
import { usePomodoroStore } from '../stores/usePomodoroStore';
import { useYoutubeStore } from '../stores/useYoutubeStore';
import { useUIStore } from '../stores/useUIStore';

export const PomodoroClock: React.FC = () => {
  const {
    mode,
    timeLeft,
    isRunning,
    sessionsCompleted,
    toggleTimer,
    resetTimer,
    skipSession,
    tick,
    setMode,
    focusDuration,
    shortBreakDuration,
    longBreakDuration
  } = usePomodoroStore();

  const { currentTitle, isPlaying: isMusicPlaying, togglePlay } = useYoutubeStore();
  const { toggleDrawer } = useUIStore();

  // Tick interval
  useEffect(() => {
    const timer = setInterval(() => {
      tick();
    }, 1000);
    return () => clearInterval(timer);
  }, [tick]);

  // Sync with browser Tab Title
  useEffect(() => {
    const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const secs = (timeLeft % 60).toString().padStart(2, '0');
    const label = mode === 'focus' ? 'Focus' : mode === 'shortBreak' ? 'Short Break' : 'Long Break';
    document.title = `(${mins}:${secs}) ${label} — VibeSpace`;
  }, [timeLeft, mode]);

  // Calculate SVG circular stroke
  const totalDuration =
    (mode === 'focus' ? focusDuration : mode === 'shortBreak' ? shortBreakDuration : longBreakDuration) * 60;
  const radius = 140;
  const circumference = 2 * Math.PI * radius; // ~879.64
  const progressRatio = Math.max(0, Math.min(1, timeLeft / totalDuration));
  const strokeDashoffset = circumference * (1 - progressRatio);

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');

  const isBreak = mode !== 'focus';
  const accentColor = isBreak ? '#4edea3' : '#f59e0b';

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto z-10 select-none">
      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-full bg-surface-container-high/60 backdrop-blur-md specular-rim mb-6">
        <button
          onClick={() => setMode('focus')}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
            mode === 'focus'
              ? 'bg-primary-container text-on-primary-container font-semibold shadow-md'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Focus (25m)
        </button>
        <button
          onClick={() => setMode('shortBreak')}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
            mode === 'shortBreak'
              ? 'bg-secondary text-black font-semibold shadow-md'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Short Break (5m)
        </button>
        <button
          onClick={() => setMode('longBreak')}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
            mode === 'longBreak'
              ? 'bg-secondary text-black font-semibold shadow-md'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Long Break (15m)
        </button>
      </div>

      {/* Circular Progress & Clock Ring */}
      <div className="relative w-72 h-72 sm:w-84 sm:h-84 md:w-96 md:h-96 flex items-center justify-center">
        {/* Background Frosted Disc */}
        <div className="absolute inset-4 rounded-full bg-surface-container-low/40 backdrop-blur-[24px] specular-rim" />

        {/* Concentric SVG Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 320 320">
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isBreak ? '#4edea3' : '#f59e0b'} />
              <stop offset="100%" stopColor={isBreak ? '#6ffbbe' : '#ffd08a'} />
            </linearGradient>
          </defs>

          {/* Inactive Track */}
          <circle
            cx="160"
            cy="160"
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="5"
          />

          {/* Active Animated Progress Stroke */}
          <circle
            cx="160"
            cy="160"
            r={radius}
            fill="transparent"
            stroke="url(#timerGradient)"
            strokeWidth="6.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-linear"
            style={{
              filter: `drop-shadow(0 0 8px ${accentColor})`,
            }}
          />
        </svg>

        {/* Interior Digits and Details */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          {/* Mode Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.08] backdrop-blur-md specular-rim mb-1">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
            <span className="text-[11px] uppercase tracking-wider text-on-surface font-medium">
              {mode === 'focus' ? 'Focus Session' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
            </span>
          </div>

          {/* Huge Digits */}
          <div className="font-display text-6xl sm:text-7xl font-light tracking-tight text-on-surface drop-shadow-md my-1">
            {minutes}:{seconds}
          </div>

          {/* Session Indicator Dots */}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-on-surface-variant font-medium">
              Session {(sessionsCompleted % 4) || 4} of 4
            </span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4].map((dot) => {
                const currentCycle = ((sessionsCompleted - 1) % 4) + 1;
                const isFilled = dot <= currentCycle;
                return (
                  <span
                    key={dot}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      isFilled ? 'bg-primary-container amber-bloom' : 'bg-white/20'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Control Deck Row */}
      <div className="flex items-center justify-center gap-4 mt-8">
        {/* Reset Button */}
        <button
          onClick={resetTimer}
          className="p-3.5 rounded-full bg-surface-container-high/50 hover:bg-surface-bright/40 text-on-surface-variant hover:text-on-surface backdrop-blur-lg specular-rim transition-all active:scale-90"
          title="Reset Interval"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* Primary Play / Pause Pill Button */}
        <button
          onClick={toggleTimer}
          className={`px-8 py-3.5 rounded-full font-display font-semibold tracking-wide flex items-center gap-2.5 active:scale-95 transition-all duration-200 ${
            isRunning
              ? 'bg-surface-container-highest text-on-surface hover:bg-surface-bright specular-rim'
              : 'bg-gradient-to-r from-primary-container to-primary text-on-primary-container hover:brightness-110 glow-amber-subtle'
          }`}
        >
          {isRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
          <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
        </button>

        {/* Skip Button */}
        <button
          onClick={skipSession}
          className="p-3.5 rounded-full bg-surface-container-high/50 hover:bg-surface-bright/40 text-on-surface-variant hover:text-on-surface backdrop-blur-lg specular-rim transition-all active:scale-90"
          title="Skip to next session"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      {/* Music Playing Status Pill below controls */}
      <div
        onClick={() => toggleDrawer('lofi')}
        className="mt-6 flex items-center gap-2.5 px-4 py-2 rounded-full bg-surface-container-low/50 backdrop-blur-md specular-rim cursor-pointer hover:bg-surface-container/70 transition-all group"
      >
        <span className={`text-xs font-semibold ${isMusicPlaying ? 'text-primary-container amber-bloom animate-pulse' : 'text-on-surface-variant'}`}>
          ♪
        </span>
        <span className="text-xs text-on-surface-variant group-hover:text-on-surface transition-colors truncate max-w-xs">
          {currentTitle || 'Lofi Radio Stream'}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          className="p-1 hover:text-primary transition-colors"
        >
          <Music className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

