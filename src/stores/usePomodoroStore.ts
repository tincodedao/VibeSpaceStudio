import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PomodoroMode } from '../types';
import { audioEngine } from '../utils/audioSynth';
import confetti from 'canvas-confetti';

interface PomodoroState {
  mode: PomodoroMode;
  timeLeft: number; // in seconds
  isRunning: boolean;
  sessionsCompleted: number;
  focusDuration: number; // in minutes (default 25)
  shortBreakDuration: number; // in minutes (default 5)
  longBreakDuration: number; // in minutes (default 15)
  soundNotification: boolean;

  // Actions
  setMode: (mode: PomodoroMode) => void;
  toggleTimer: () => void;
  resetTimer: () => void;
  skipSession: () => void;
  tick: () => void;
  updateDurations: (focus: number, shortBreak: number, longBreak: number) => void;
  toggleSound: () => void;
}

const getDurationForMode = (mode: PomodoroMode, state: { focusDuration: number; shortBreakDuration: number; longBreakDuration: number }) => {
  switch (mode) {
    case 'focus': return state.focusDuration * 60;
    case 'shortBreak': return state.shortBreakDuration * 60;
    case 'longBreak': return state.longBreakDuration * 60;
  }
};

export const usePomodoroStore = create<PomodoroState>()(
  persist(
    (set, get) => ({
      mode: 'focus',
      timeLeft: 25 * 60,
      isRunning: false,
      sessionsCompleted: 1,
      focusDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      soundNotification: true,

      setMode: (mode) => {
        const dur = getDurationForMode(mode, get());
        set({ mode, timeLeft: dur, isRunning: false });
      },

      toggleTimer: () => {
        const { isRunning } = get();
        set({ isRunning: !isRunning });
      },

      resetTimer: () => {
        const { mode } = get();
        const dur = getDurationForMode(mode, get());
        set({ timeLeft: dur, isRunning: false });
      },

      skipSession: () => {
        const { mode, sessionsCompleted } = get();
        if (mode === 'focus') {
          const nextMode = (sessionsCompleted % 4 === 0) ? 'longBreak' : 'shortBreak';
          const dur = getDurationForMode(nextMode, get());
          set({ mode: nextMode, timeLeft: dur, isRunning: false });
        } else {
          const dur = getDurationForMode('focus', get());
          set({
            mode: 'focus',
            timeLeft: dur,
            isRunning: false,
            sessionsCompleted: sessionsCompleted + 1
          });
        }
      },

      tick: () => {
        const { timeLeft, isRunning, mode, sessionsCompleted, soundNotification } = get();
        if (!isRunning) return;

        if (timeLeft > 1) {
          set({ timeLeft: timeLeft - 1 });
        } else {
          // Finished session!
          if (soundNotification) {
            audioEngine.playChime();
          }

          if (mode === 'focus') {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 }
            });

            const nextMode = (sessionsCompleted % 4 === 0) ? 'longBreak' : 'shortBreak';
            const dur = getDurationForMode(nextMode, get());
            set({ mode: nextMode, timeLeft: dur, isRunning: false });
          } else {
            const dur = getDurationForMode('focus', get());
            set({
              mode: 'focus',
              timeLeft: dur,
              isRunning: false,
              sessionsCompleted: sessionsCompleted + 1
            });
          }
        }
      },

      updateDurations: (focus, shortBreak, longBreak) => {
        set({
          focusDuration: focus,
          shortBreakDuration: shortBreak,
          longBreakDuration: longBreak
        });
        const currentMode = get().mode;
        const dur = getDurationForMode(currentMode, { focusDuration: focus, shortBreakDuration: shortBreak, longBreakDuration: longBreak });
        set({ timeLeft: dur, isRunning: false });
      },

      toggleSound: () => set((s) => ({ soundNotification: !s.soundNotification })),
    }),
    {
      name: 'vibespace-pomodoro-store',
      partialize: (s) => ({
        sessionsCompleted: s.sessionsCompleted,
        focusDuration: s.focusDuration,
        shortBreakDuration: s.shortBreakDuration,
        longBreakDuration: s.longBreakDuration,
        soundNotification: s.soundNotification
      }),
    }
  )
);

