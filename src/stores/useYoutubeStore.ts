import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LofiChannel {
  id: string;
  name: string;
  videoId: string;
  tag: string;
  desc: string;
}

export const LOFI_CHANNELS: LofiChannel[] = [
  {
    id: 'lofi-girl',
    name: 'Lofi Girl',
    videoId: 'jfKfPfyJRdk', // Lofi hip hop radio - beats to relax/study to
    tag: 'Hip Hop',
    desc: 'Lofi hip hop radio - beats to relax/study to'
  },
  {
    id: 'chillhop',
    name: 'Chillhop Music',
    videoId: '5yx6BWlEVcY', // Chillhop Radio - jazzy & lofi hip hop beats
    tag: 'Jazzy',
    desc: 'Jazzy & lofi hip hop beats'
  },
  {
    id: 'synthwave',
    name: 'Synthwave Radio',
    videoId: '4xDzrJKXOOY', // Synthwave radio - chill synth / retro beats
    tag: 'Retro',
    desc: 'Chill synth & retro beats'
  },
  {
    id: 'coffee-jazz',
    name: 'Coffee Shop Jazz',
    videoId: 'lTRiuFIWV54', // Relaxing Jazz Piano Music
    tag: 'Piano',
    desc: 'Relaxing cafe & warm piano chords'
  }
];

interface YoutubeState {
  currentVideoId: string;
  currentTitle: string;
  isPlaying: boolean;
  volume: number; // 0 to 100
  isMuted: boolean;

  // Actions
  setVideoId: (id: string, title?: string) => void;
  parseAndPlayUrl: (url: string) => boolean;
  selectChannel: (channelId: string) => void;
  togglePlay: () => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
}

// Extract YouTube video ID from various URL formats
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const cleanUrl = url.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) {
    return cleanUrl;
  }
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = cleanUrl.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export const useYoutubeStore = create<YoutubeState>()(
  persist(
    (set) => ({
      currentVideoId: LOFI_CHANNELS[0].videoId,
      currentTitle: LOFI_CHANNELS[0].desc,
      isPlaying: false,
      volume: 75,
      isMuted: false,

      setVideoId: (id, title) => {
        set({
          currentVideoId: id,
          currentTitle: title || 'Custom YouTube Stream',
          isPlaying: true
        });
      },

      parseAndPlayUrl: (url) => {
        const id = extractYouTubeId(url);
        if (id) {
          set({
            currentVideoId: id,
            currentTitle: 'Custom Stream: ' + id,
            isPlaying: true
          });
          return true;
        }
        return false;
      },

      selectChannel: (channelId) => {
        const ch = LOFI_CHANNELS.find(c => c.id === channelId);
        if (ch) {
          set({
            currentVideoId: ch.videoId,
            currentTitle: ch.desc,
            isPlaying: true
          });
        }
      },

      togglePlay: () => set(s => ({ isPlaying: !s.isPlaying })),
      setVolume: (volume) => set({ volume, isMuted: false }),
      toggleMute: () => set(s => ({ isMuted: !s.isMuted }))
    }),
    {
      name: 'vibespace-youtube-store',
      partialize: (s) => ({
        currentVideoId: s.currentVideoId,
        currentTitle: s.currentTitle,
        volume: s.volume,
        isMuted: s.isMuted
      })
    }
  )
);
