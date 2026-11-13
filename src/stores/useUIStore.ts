import { create } from 'zustand';

export type ActiveDrawer = 'none' | 'soundboard' | 'lofi' | 'todo' | 'wallpaper' | 'settings';

interface UIState {
  activeDrawer: ActiveDrawer;
  isZenMode: boolean;
  isFullscreen: boolean;

  // Actions
  openDrawer: (drawer: ActiveDrawer) => void;
  closeDrawer: () => void;
  toggleDrawer: (drawer: ActiveDrawer) => void;
  toggleZenMode: () => void;
  setZenMode: (val: boolean) => void;
  toggleFullscreen: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  activeDrawer: 'none',
  isZenMode: false,
  isFullscreen: false,

  openDrawer: (drawer) => set({ activeDrawer: drawer, isZenMode: false }),
  closeDrawer: () => set({ activeDrawer: 'none' }),
  toggleDrawer: (drawer) => {
    const current = get().activeDrawer;
    set({ activeDrawer: current === drawer ? 'none' : drawer, isZenMode: false });
  },

  toggleZenMode: () => {
    const current = get().isZenMode;
    set({ isZenMode: !current, activeDrawer: 'none' });
  },

  setZenMode: (val) => set({ isZenMode: val, activeDrawer: 'none' }),

  toggleFullscreen: () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      set({ isFullscreen: true });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      set({ isFullscreen: false });
    }
  }
}));

