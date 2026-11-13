import React, { useState } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Link, Radio, ExternalLink } from 'lucide-react';
import { useYoutubeStore, LOFI_CHANNELS } from '../stores/useYoutubeStore';
import { useUIStore } from '../stores/useUIStore';

export const YoutubePlayer: React.FC = () => {
  const {
    currentVideoId,
    currentTitle,
    isPlaying,
    volume,
    isMuted,
    togglePlay,
    setVolume,
    toggleMute,
    parseAndPlayUrl,
    selectChannel,
  } = useYoutubeStore();

  const { activeDrawer, closeDrawer } = useUIStore();
  const [urlInput, setUrlInput] = useState('');
  const [inputError, setInputError] = useState(false);

  const isOpen = activeDrawer === 'lofi';

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    const success = parseAndPlayUrl(urlInput);
    if (success) {
      setUrlInput('');
      setInputError(false);
    } else {
      setInputError(true);
    }
  };

  return (
    <>
      {/* Hidden/Persistent YouTube IFrame (keeps playing when widget is minimized) */}
      <div className="fixed -bottom-96 -right-96 w-1 h-1 opacity-0 pointer-events-none">
        <iframe
          src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=${isPlaying ? 1 : 0}&enablejsapi=1&controls=0&mute=${isMuted ? 1 : 0}`}
          title="YouTube Audio Player"
          allow="autoplay; encrypted-media"
        />
      </div>

      {/* Floating Mini-Player Dialog */}
      {isOpen && (
        <aside className="fixed bottom-24 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-6 z-50 w-[92vw] sm:w-[400px] glass-panel rounded-3xl p-5 shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-primary animate-pulse" />
              <span className="font-display text-sm font-semibold text-on-surface">
                Lofi Music Player
              </span>
            </div>
            <button
              onClick={closeDrawer}
              className="p-1.5 rounded-full hover:bg-white/10 text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Now Playing Card */}
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-surface-container-high/40 specular-rim">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-black flex-shrink-0">
              <img
                src={`https://img.youtube.com/vi/${currentVideoId}/hqdefault.jpg`}
                alt="Track Thumbnail"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=200&auto=format&fit=crop';
                }}
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="flex items-end gap-0.5 h-4">
                    <span className="w-1 bg-primary rounded-full animate-bounce [animation-delay:0ms] h-4" />
                    <span className="w-1 bg-primary rounded-full animate-bounce [animation-delay:150ms] h-3" />
                    <span className="w-1 bg-primary rounded-full animate-bounce [animation-delay:300ms] h-5" />
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-red-500/80 text-white uppercase tracking-wider">
                  Live
                </span>
                <span className="text-[11px] text-on-surface-variant truncate">
                  Stream ID: {currentVideoId}
                </span>
              </div>
              <h3 className="text-xs font-semibold text-on-surface truncate">
                {currentTitle}
              </h3>
              <a
                href={`https://youtube.com/watch?v=${currentVideoId}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline mt-1"
              >
                Open on YouTube <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>

          {/* Animated Waveform Bars */}
          <div className="flex items-center justify-between gap-1 h-6 px-1">
            {[40, 60, 20, 80, 50, 90, 30, 70, 45, 85, 35, 95, 60, 40, 75, 55, 30, 80, 65, 45].map(
              (height, idx) => (
                <span
                  key={idx}
                  className={`flex-1 rounded-full transition-all duration-300 ${
                    isPlaying ? 'bg-primary/70 animate-pulse' : 'bg-white/10'
                  }`}
                  style={{
                    height: isPlaying ? `${Math.max(15, (height * (idx % 2 === 0 ? 0.9 : 1.1)) % 100)}%` : '15%',
                    animationDelay: `${idx * 60}ms`,
                  }}
                />
              )
            )}
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              onClick={togglePlay}
              className="flex-1 py-2.5 rounded-full bg-gradient-to-r from-primary-container to-primary text-on-primary-container font-semibold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md glow-amber-subtle"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause Stream</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Play Lofi Stream</span>
                </>
              )}
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-surface-container-high/50 specular-rim">
              <button
                onClick={toggleMute}
                className="text-on-surface-variant hover:text-on-surface transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-red-400" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="w-16 h-1 accent-primary cursor-pointer bg-white/10 rounded-lg appearance-none"
              />
            </div>
          </div>

          {/* Quick Channels Tags */}
          <div>
            <div className="text-[11px] text-on-surface-variant font-medium mb-1.5">
              Popular Channels
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {LOFI_CHANNELS.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => selectChannel(ch.id)}
                  className={`px-2.5 py-1.5 rounded-xl text-left text-xs transition-all flex items-center justify-between ${
                    currentVideoId === ch.videoId
                      ? 'bg-primary/20 text-primary border border-primary/30 font-medium'
                      : 'bg-surface-container-high/40 hover:bg-surface-container-high/80 text-on-surface-variant hover:text-on-surface border border-white/5'
                  }`}
                >
                  <span className="truncate">{ch.name}</span>
                  <span className="text-[9px] opacity-60 ml-1">{ch.tag}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom YouTube URL Input */}
          <form onSubmit={handleUrlSubmit} className="pt-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Paste YouTube URL or Video ID..."
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  setInputError(false);
                }}
                className={`w-full px-3.5 py-2 pl-9 text-xs rounded-xl bg-surface-container-high/60 border ${
                  inputError
                    ? 'border-red-500 text-red-200'
                    : 'border-white/10 text-on-surface focus:border-primary'
                } focus:outline-none placeholder-white/30`}
              />
              <Link className="absolute left-3 top-2.5 w-3.5 h-3.5 text-on-surface-variant" />
              <button
                type="submit"
                className="absolute right-1.5 top-1 px-2.5 py-1 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary text-[10px] font-semibold transition-colors"
              >
                Play
              </button>
            </div>
            {inputError && (
              <span className="text-[10px] text-red-400 mt-1 block px-1">
                Invalid YouTube link. Please paste a valid video or watch link.
              </span>
            )}
          </form>
        </aside>
      )}
    </>
  );
};

