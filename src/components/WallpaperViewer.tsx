import React from 'react';
import { useWallpaperStore } from '../stores/useWallpaperStore';

export const WallpaperViewer: React.FC = () => {
  const { currentWallpaper, dimmerOpacity, blurRadius } = useWallpaperStore();

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none">
      {/* Background Image Layer */}
      <img
        src={currentWallpaper.url}
        alt={currentWallpaper.title}
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

