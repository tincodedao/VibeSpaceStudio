import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Wallpaper } from '../types';
import { useAuthStore } from './useAuthStore';
import { API_BASE_URL } from '../lib/supabase';

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

export interface CustomWallpaperItem {
  id: string;
  title: string;
  url: string;
  type: 'image' | 'video';
}

interface WallpaperState {
  currentWallpaper: Wallpaper;
  customWallpapers: CustomWallpaperItem[];
  dimmerOpacity: number; // 0 to 0.8
  blurRadius: number; // 0 to 20 px

  // Actions
  setWallpaper: (wallpaper: Wallpaper) => void;
  setDimmerOpacity: (val: number) => void;
  setBlurRadius: (val: number) => void;
  shuffleWallpaper: () => void;
  addCustomWallpaper: (title: string, url: string, type?: 'image' | 'video') => Promise<void>;
  removeCustomWallpaper: (id: string) => Promise<void>;
  setCustomWallpapers: (wallpapers: CustomWallpaperItem[]) => void;
}

export const useWallpaperStore = create<WallpaperState>()(
  persist(
    (set, get) => ({
      currentWallpaper: CURATED_WALLPAPERS[0],
      customWallpapers: [],
      dimmerOpacity: 0.35,
      blurRadius: 0,

      setWallpaper: (wallpaper) => set({ currentWallpaper: wallpaper }),
      setDimmerOpacity: (val) => set({ dimmerOpacity: Math.max(0, Math.min(0.8, val)) }),
      setBlurRadius: (val) => set({ blurRadius: Math.max(0, Math.min(20, val)) }),
      setCustomWallpapers: (customWallpapers) => set({ customWallpapers }),

      shuffleWallpaper: () => {
        const { currentWallpaper, customWallpapers } = get();
        const all = [
          ...CURATED_WALLPAPERS,
          ...customWallpapers.map(cw => ({
            id: cw.id,
            title: cw.title,
            category: 'custom' as any,
            url: cw.url,
            thumbnail: cw.url,
            type: cw.type
          }))
        ];
        const remaining = all.filter(w => w.id !== currentWallpaper.id);
        const randomChoice = remaining[Math.floor(Math.random() * remaining.length)] || all[0];
        set({ currentWallpaper: randomChoice });
      },

      addCustomWallpaper: async (title, url, type = 'image') => {
        if (!url.trim()) return;
        const tempId = Date.now().toString();
        const newItem: CustomWallpaperItem = {
          id: tempId,
          title: title.trim() || 'My Wallpaper',
          url: url.trim(),
          type
        };

        set(s => ({
          customWallpapers: [newItem, ...s.customWallpapers],
          currentWallpaper: {
            id: newItem.id,
            title: newItem.title,
            category: 'custom' as any,
            url: newItem.url,
            thumbnail: newItem.url,
            type: newItem.type
          }
        }));

        const { session } = useAuthStore.getState();
        if (session) {
          try {
            const res = await fetch(`${API_BASE_URL}/wallpapers`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.access_token}`
              },
              body: JSON.stringify({
                title: newItem.title,
                url: newItem.url,
                type: newItem.type
              })
            });
            if (res.ok) {
              const created = await res.json();
              set(s => ({
                customWallpapers: s.customWallpapers.map(w => w.id === tempId ? { ...w, id: created.id } : w)
              }));
            }
          } catch (e) {
            console.error('[Wallpaper API] Add failed:', e);
          }
        }
      },

      removeCustomWallpaper: async (id) => {
        set(s => ({
          customWallpapers: s.customWallpapers.filter(w => w.id !== id)
        }));

        const { session } = useAuthStore.getState();
        if (session) {
          try {
            await fetch(`${API_BASE_URL}/wallpapers/${id}`, {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${session.access_token}`
              }
            });
          } catch (e) {
            console.error('[Wallpaper API] Delete failed:', e);
          }
        }
      }
    }),
    {
      name: 'vibespace-wallpaper-storage',
      partialize: (s) => ({
        currentWallpaper: s.currentWallpaper,
        customWallpapers: s.customWallpapers,
        dimmerOpacity: s.dimmerOpacity,
        blurRadius: s.blurRadius
      })
    }
  )
);
