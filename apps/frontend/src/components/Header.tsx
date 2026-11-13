import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Maximize2, Minimize2, Sparkles } from 'lucide-react';
import { useMixerStore } from '../stores/useMixerStore';
import { useUIStore } from '../stores/useUIStore';

export const Header: React.FC = () => {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const { masterVolume, setMasterVolume, isMuted, toggleMasterMute, activeCount } = useMixerStore();
  const { isFullscreen, toggleFullscreen, toggleDrawer, isZenMode } = useUIStore();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
      setDateStr(
        now.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (isZenMode) return null;

  return (
    <header className="w-full fixed top-0 left-0 z-40 bg-surface-container/40 backdrop-blur-md border-b border-white/10 transition-all duration-300">
      <div className="flex justify-between items-center w-full px-6 py-3 max-w-7xl mx-auto">
        {/* Brand & Focus Status */}
        <div className="flex items-center gap-3.5">
          <div className="font-display text-lg font-semibold tracking-tight text-on-surface flex items-center gap-2 group cursor-pointer">
            <span className="w-2.5 h-2.5 rounded-full bg-primary-container amber-bloom group-hover:scale-125 transition-transform duration-200" />
            <span>VibeSpace</span>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-high/60 specular-rim text-xs text-on-surface-variant">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            Deep Work
          </span>
        </div>

        {/* Realtime Clock & Date */}
        <div className="flex flex-col items-center justify-center select-text">
          <div className="font-mono text-sm sm:text-base font-medium tracking-wider text-on-surface drop-shadow-sm">
            {timeStr || '12:00:00 PM'}
          </div>
          <div className="text-[11px] text-on-surface-variant font-normal tracking-wide opacity-80">
            {dateStr}
          </div>
        </div>

        {/* Quick Action Pods */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Master Volume Slider Pod */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high/50 specular-rim text-on-surface-variant">
            <button
              onClick={toggleMasterMute}
              className="hover:text-primary transition-colors focus:outline-none"
              title={isMuted ? 'Unmute master' : 'Mute master'}
            >
              {isMuted || masterVolume === 0 ? (
                <VolumeX className="w-4 h-4 text-red-400" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : masterVolume}
              onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
              className="w-16 h-1 accent-primary cursor-pointer bg-surface-container-highest rounded-lg appearance-none"
            />
            {activeCount() > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-secondary/20 text-secondary font-mono">
                {activeCount()}
              </span>
            )}
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-white/10 specular-rim transition-all active:scale-95"
            title="Toggle Fullscreen (F)"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Wallpapers / Visual Modal Button */}
          <button
            onClick={() => toggleDrawer('wallpaper')}
            className="p-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-white/10 specular-rim transition-all active:scale-95"
            title="Choose Wallpaper"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
