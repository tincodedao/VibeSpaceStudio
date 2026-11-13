import React from 'react';
import { useWallpaperStore, CURATED_WALLPAPERS } from '../stores/useWallpaperStore';

export const WallpaperViewer: React.FC = () => {
  const { currentWallpaper, dimmerOpacity = 0.35, blurRadius = 0 } = useWallpaperStore();

  const activeWallpaper = currentWallpaper || CURATED_WALLPAPERS[0];
  const wallpaperUrl = activeWallpaper?.url || CURATED_WALLPAPERS[0].url;
  const wallpaperTitle = activeWallpaper?.title || CURATED_WALLPAPERS[0].title;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none">
      {/* Background Image Layer */}
      <img
        src={wallpaperUrl}
        alt={wallpaperTitle}
        className="w-full h-full object-cover object-center scale-105 transition-all duration-700 ease-out"
        style={{
          filter: `blur(${blurRadius}px) brightness(0.9) contrast(1.05)`,
        }}
      />

      {/* Dimmer Overlay Slider */}
      <div
        className="absolute inset-0 bg-black transition-opacity duration-300"
        style={{ opacity: dimmerOpacity }}
      />

      {/* Atmospheric Subtle Vignette Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-black/40 pointer-events-none" />
    </div>
  );
};
