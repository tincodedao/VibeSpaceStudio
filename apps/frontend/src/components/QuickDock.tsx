import React from 'react';
import { Radio, Sliders, CheckSquare, Image as ImageIcon, Sparkles } from 'lucide-react';
import { useUIStore } from '../stores/useUIStore';
import { useTodoStore } from '../stores/useTodoStore';
import { useMixerStore } from '../stores/useMixerStore';
import { useYoutubeStore } from '../stores/useYoutubeStore';

export const QuickDock: React.FC = () => {
  const { activeDrawer, toggleDrawer, toggleZenMode, isZenMode } = useUIStore();
  const { todos } = useTodoStore();
  const { activeCount } = useMixerStore();
  const { isPlaying: isYoutubePlaying } = useYoutubeStore();

  const pendingTodosCount = todos.filter((t) => !t.completed).length;

  if (isZenMode) return null;

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 px-4 py-1.5 rounded-full glass-dock shadow-2xl transition-all duration-300">
      {/* Item 1: Lofi Player */}
      <button
        onClick={() => toggleDrawer('lofi')}
        className={`relative p-3 rounded-full flex flex-col items-center justify-center transition-all duration-200 active:scale-90 ${
          activeDrawer === 'lofi'
            ? 'text-primary'
            : 'text-on-surface-variant hover:text-on-surface hover:bg-white/10'
        }`}
        title="Lofi Music Player"
      >
        <Radio className="w-5 h-5" />
        <span className="text-[10px] mt-0.5 font-medium">Lofi Music</span>
        {isYoutubePlaying && (
          <span className="absolute bottom-1 w-1 h-1 bg-primary rounded-full" />
        )}
      </button>

      {/* Item 2: Ambient Soundboard */}
      <button
        onClick={() => toggleDrawer('soundboard')}
        className={`relative p-3 rounded-full flex flex-col items-center justify-center transition-all duration-200 active:scale-90 ${
          activeDrawer === 'soundboard'
            ? 'text-primary'
            : 'text-on-surface-variant hover:text-on-surface hover:bg-white/10'
        }`}
        title="Ambient Sound Mixer"
      >
        <Sliders className="w-5 h-5" />
        <span className="text-[10px] mt-0.5 font-medium">Mixer</span>
        {activeCount() > 0 && (
          <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-secondary text-black text-[9px] font-bold flex items-center justify-center leading-none">
            {activeCount()}
          </span>
        )}
      </button>

      {/* Item 3: Daily Todo List */}
      <button
        onClick={() => toggleDrawer('todo')}
        className={`relative p-3 rounded-full flex flex-col items-center justify-center transition-all duration-200 active:scale-90 ${
          activeDrawer === 'todo'
            ? 'text-primary'
            : 'text-on-surface-variant hover:text-on-surface hover:bg-white/10'
        }`}
        title="Daily Tasks"
      >
        <CheckSquare className="w-5 h-5" />
        <span className="text-[10px] mt-0.5 font-medium">Tasks</span>
        {pendingTodosCount > 0 && (
          <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-primary-container text-on-primary-container text-[9px] font-bold flex items-center justify-center leading-none">
            {pendingTodosCount}
          </span>
        )}
      </button>

      {/* Item 4: Wallpaper Selector */}
      <button
        onClick={() => toggleDrawer('wallpaper')}
        className={`relative p-3 rounded-full flex flex-col items-center justify-center transition-all duration-200 active:scale-90 ${
          activeDrawer === 'wallpaper'
            ? 'text-primary'
            : 'text-on-surface-variant hover:text-on-surface hover:bg-white/10'
        }`}
        title="Wallpapers & Atmosphere"
      >
        <ImageIcon className="w-5 h-5" />
        <span className="text-[10px] mt-0.5 font-medium">Wallpapers</span>
      </button>

      {/* Item 5: Zen Mode */}
      <button
        onClick={toggleZenMode}
        className="relative p-3 rounded-full flex flex-col items-center justify-center text-on-surface-variant hover:text-primary hover:bg-white/10 transition-all duration-200 active:scale-90"
        title="Enter Zen Mode (Z)"
      >
        <Sparkles className="w-5 h-5" />
        <span className="text-[10px] mt-0.5 font-medium">Zen Mode</span>
      </button>
    </nav>
  );
};

