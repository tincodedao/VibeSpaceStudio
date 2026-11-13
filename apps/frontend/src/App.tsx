import React from 'react';
import { WallpaperViewer } from './components/WallpaperViewer';
import { Header } from './components/Header';
import { PomodoroClock } from './components/PomodoroClock';
import { QuickDock } from './components/QuickDock';
import { SoundboardDrawer } from './components/SoundboardDrawer';
import { YoutubePlayer } from './components/YoutubePlayer';
import { TodoDrawer } from './components/TodoDrawer';
import { WallpaperModal } from './components/WallpaperModal';
import { ZenModeView } from './components/ZenModeView';
import { useDailyReset } from './hooks/useDailyReset';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useUIStore } from './stores/useUIStore';

export const App: React.FC = () => {
  // Activate automatic background hooks
  useDailyReset();
  useKeyboardShortcuts();

  const { isZenMode } = useUIStore();

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden">
      {/* 1. Dynamic Wallpaper & Ambient Lighting */}
      <WallpaperViewer />

      {/* 2. Top Header Navigation (hidden in Zen Mode) */}
      <Header />

      {/* 3. Main Central Workspace */}
      <main className={`relative z-10 flex-1 flex flex-col items-center justify-center px-4 transition-all duration-500 ${
        isZenMode ? 'opacity-0 pointer-events-none' : 'opacity-100 pt-16 pb-24'
      }`}>
        <PomodoroClock />
      </main>

      {/* 4. Bottom Floating Quick Dock (hidden in Zen Mode) */}
      <QuickDock />

      {/* 5. Drawers and Modals */}
      <SoundboardDrawer />
      <YoutubePlayer />
      <TodoDrawer />
      <WallpaperModal />

      {/* 6. Zen Mode View (shows when Zen mode is active) */}
      <ZenModeView />
    </div>
  );
};

export default App;

