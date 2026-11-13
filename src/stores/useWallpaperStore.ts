import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Wallpaper } from '../types';

export const CURATED_WALLPAPERS: Wallpaper[] = [
  {
    id: 'forest-mist',
    title: 'Misty Pine Forest',
    category: 'forest',
    url: 'https://images.unsplash.com/photo-1511497584788-87676104235f?q=80&w=2560&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1511497584788-87676104235f?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'ocean-night',
    title: 'Pacific Ocean Dusk',
    category: 'ocean',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2560&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'snowy-mountains',
    title: 'Alpine Twilight Peaks',
    category: 'mountains',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2560&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'galaxy-sky',
    title: 'Milky Way Galaxy',
    category: 'galaxy',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=2560&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'cozy-rain-window',
    title: 'Rain On Cabin Window',
    category: 'cozy',
    url: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?q=80&w=2560&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'minimal-gradient',
    title: 'Atmospheric Aura',
    category: 'minimal',
    url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2560&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=400&auto=format&fit=crop'
  }
];

interface WallpaperState {
  currentWallpaper: Wallpaper;
  dimmerOpacity: number; // 0 to 0.8
  blurRadius: number; // 0 to 20 px

  // Actions
  setWallpaper: (wallpaper: Wallpaper) => void;
  setDimmerOpacity: (val: number) => void;
  setBlurRadius: (val: number) => void;
  shuffleWallpaper: () => void;
}

export const useWallpaperStore = create<WallpaperState>()(
  persist(
    (set, get) => ({
      currentWallpaper: CURATED_WALLPAPERS[0],
      dimmerOpacity: 0.35,
      blurRadius: 0,

      setWallpaper: (wallpaper) => set({ currentWallpaper: wallpaper }),
      setDimmerOpacity: (val) => set({ dimmerOpacity: Math.max(0, Math.min(0.8, val)) }),
      setBlurRadius: (val) => set({ blurRadius: Math.max(0, Math.min(20, val)) }),
      shuffleWallpaper: () => {
        const { currentWallpaper } = get();
        const others = CURATED_WALLPAPERS.filter(w => w.id !== currentWallpaper.id);
        const random = others[Math.floor(Math.random() * others.length)];
        set({ currentWallpaper: random });
      }
    }),
    {
      name: 'vibespace-wallpaper-store'
    }
  )
);

