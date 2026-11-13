import React from 'react';
import {
  X,
  Volume2,
  VolumeX,
  CloudRain,
  CloudLightning,
  Flame,
  Wind,
  Waves,
  Coffee,
  Keyboard,
  Droplets,
  Bird,
  Activity,
  Sparkles
} from 'lucide-react';
import { useMixerStore, PRESETS } from '../stores/useMixerStore';
import { useUIStore } from '../stores/useUIStore';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  CloudRain,
  CloudLightning,
  Flame,
  Wind,
  Waves,
  Coffee,
  Keyboard,
  Droplets,
  Bird,
  Activity,
};

export const SoundboardDrawer: React.FC = () => {
  const {
    tracks,
    masterVolume,
    isMuted,
    toggleTrack,
    setTrackVolume,
    setMasterVolume,
    toggleMasterMute,
    applyPreset,
    stopAll,
    activeCount,
  } = useMixerStore();

  const { activeDrawer, closeDrawer } = useUIStore();
  const isOpen = activeDrawer === 'soundboard';

  if (!isOpen) return null;

  return (
    <aside className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] glass-panel border-l border-white/10 shadow-2xl flex flex-col transition-all duration-300 animate-in slide-in-from-right">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <h2 className="font-display text-lg font-semibold text-on-surface">Ambient Soundboard</h2>
          {activeCount() > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/20 text-secondary font-medium">
              {activeCount()} active
            </span>
          )}
        </div>
        <button
          onClick={closeDrawer}
          className="p-1.5 rounded-full hover:bg-white/10 text-on-surface-variant hover:text-on-surface transition-colors"
          title="Close drawer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Master Controls & Presets */}
      <div className="p-5 border-b border-white/10 space-y-4">
        {/* Master Volume Row */}
        <div className="flex items-center justify-between gap-3 bg-surface-container-high/40 p-3 rounded-xl specular-rim">
          <div className="flex items-center gap-2 text-sm font-medium text-on-surface">
            <button
              onClick={toggleMasterMute}
              className="p-1 rounded-md hover:text-primary transition-colors"
            >
              {isMuted || masterVolume === 0 ? (
                <VolumeX className="w-4 h-4 text-red-400" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <span>Master Volume</span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : masterVolume}
              onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
              className="w-28 h-1.5 accent-primary cursor-pointer bg-surface-container-highest rounded-lg appearance-none"
            />
            {activeCount() > 0 && (
              <button
                onClick={stopAll}
                className="text-[11px] px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-on-surface-variant transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Quick Presets Bar */}
        <div>
          <div className="flex items-center gap-1.5 mb-2 text-xs text-on-surface-variant font-medium">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Sound Presets</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => applyPreset(p.id)}
                className="px-3 py-1.5 rounded-full text-xs bg-surface-container-high/60 hover:bg-surface-bright/80 specular-rim text-on-surface hover:text-primary transition-all active:scale-95 flex items-center gap-1.5"
              >
                <span>{p.icon}</span>
                <span>{p.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sound Cards Grid (2 Columns) */}
      <div className="flex-1 overflow-y-auto p-5 grid grid-cols-2 gap-3">
        {tracks.map((track) => {
          const IconComp = ICON_MAP[track.icon] || Activity;
          const isActive = track.isPlaying && !isMuted;

          return (
            <div
              key={track.id}
              onClick={() => toggleTrack(track.id)}
              className={`p-3.5 rounded-2xl cursor-pointer transition-all flex flex-col justify-between group ${
                isActive
                  ? 'bg-surface-container-high/80 border border-primary/40 shadow-lg'
                  : 'bg-surface-container/40 border border-white/5 hover:border-white/15 hover:bg-surface-container/60'
              }`}
            >
              {/* Card Top: Icon & Toggle */}
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    isActive
                      ? 'bg-primary/20 text-primary amber-bloom'
                      : 'bg-white/5 text-on-surface-variant group-hover:text-on-surface'
                  }`}
                >
                  <IconComp className="w-5 h-5" />
                </div>
                <div
                  className={`w-4 h-4 rounded-full border transition-all flex items-center justify-center ${
                    isActive ? 'border-primary bg-primary' : 'border-white/20'
                  }`}
                >
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                </div>
              </div>

              {/* Card Title */}
              <div className="mb-3">
                <div className="text-xs font-medium text-on-surface">{track.name}</div>
                <div className="text-[10px] text-on-surface-variant capitalize">
                  {track.category}
                </div>
              </div>

              {/* Volume Slider inside Card */}
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 pt-1"
              >
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={track.volume}
                  onChange={(e) => setTrackVolume(track.id, parseFloat(e.target.value))}
                  className="w-full h-1 accent-primary cursor-pointer bg-white/10 rounded-lg appearance-none"
                />
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

