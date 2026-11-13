import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Maximize2, Minimize2, Sparkles, User, Cloud, LogOut, Loader2 } from 'lucide-react';
import { useMixerStore } from '../stores/useMixerStore';
import { useUIStore } from '../stores/useUIStore';
import { useAuthStore } from '../stores/useAuthStore';

export const Header: React.FC = () => {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { masterVolume, setMasterVolume, isMuted, toggleMasterMute, activeCount } = useMixerStore();
  const { isFullscreen, toggleFullscreen, toggleDrawer, isZenMode } = useUIStore();
  const { user, profile, openAuthModal, signOut, syncWithCloud, isSyncing } = useAuthStore();

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

          {/* User Auth Profile Pod */}
          <div className="relative">
            {user ? (
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 py-1 px-2.5 rounded-full bg-white/10 hover:bg-white/15 specular-rim text-xs text-white transition-all border border-amber-400/30"
              >
                <div className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-[10px]">
                  {profile?.display_name ? profile.display_name[0].toUpperCase() : user.email?.[0].toUpperCase() || 'U'}
                </div>
                <span className="max-w-[80px] sm:max-w-[120px] truncate hidden sm:inline">
                  {profile?.display_name || user.email?.split('@')[0]}
                </span>
                {isSyncing && <Loader2 size={12} className="animate-spin text-amber-300" />}
              </button>
            ) : (
              <button
                onClick={openAuthModal}
                className="flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-900 font-medium text-xs shadow-md transition-all active:scale-95"
              >
                <User size={13} />
                <span>Đăng nhập</span>
              </button>
            )}

            {/* Dropdown Menu */}
            {user && showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 py-2 rounded-xl glass-panel specular-rim bg-slate-900/90 border border-white/10 shadow-xl z-50">
                <div className="px-3 py-1.5 border-b border-white/10">
                  <p className="text-[11px] text-white/50">Đã đăng nhập:</p>
                  <p className="text-xs font-semibold text-white truncate">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    syncWithCloud();
                    setShowUserMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs text-white/80 hover:text-white hover:bg-white/10 flex items-center gap-2"
                >
                  <Cloud size={14} className={isSyncing ? 'animate-spin text-amber-400' : 'text-amber-400'} />
                  <span>Đồng bộ đám mây</span>
                </button>
                <button
                  onClick={() => {
                    signOut();
                    setShowUserMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs text-rose-300 hover:text-rose-200 hover:bg-white/10 flex items-center gap-2"
                >
                  <LogOut size={14} />
                  <span>Đăng xuất</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
