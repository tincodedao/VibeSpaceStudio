import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore } from './useAuthStore';
import { API_BASE_URL } from '../lib/supabase';

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
    videoId: 'jfKfPfyJRdk',
    tag: 'Hip Hop',
    desc: 'Lofi hip hop radio - beats to relax/study to'
  },
  {
    id: 'chillhop',
    name: 'Chillhop Music',
    videoId: '5yx6BWlEVcY',
    tag: 'Jazzy',
    desc: 'Jazzy & lofi hip hop beats'
  },
  {
    id: 'synthwave',
    name: 'Synthwave Radio',
    videoId: '4xDzrJKXOOY',
    tag: 'Retro',
    desc: 'Chill synth & retro beats'
  },
  {
    id: 'coffee-jazz',
    name: 'Coffee Shop Jazz',
    videoId: 'lTRiuFIWV54',
    tag: 'Piano',
    desc: 'Relaxing cafe & warm piano chords'
  }
];

export interface CustomTrackItem {
  id: string;
  youtubeId: string;
  title: string;
  channel?: string;
}

interface YoutubeState {
  currentVideoId: string;
  currentTitle: string;
  isPlaying: boolean;
  volume: number; // 0 to 100
  isMuted: boolean;
  customTracks: CustomTrackItem[];

  // Actions
  setVideoId: (id: string, title?: string) => void;
  parseAndPlayUrl: (url: string) => boolean;
  selectChannel: (channelId: string) => void;
  togglePlay: () => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  addCustomTrack: (youtubeId: string, title: string, channel?: string) => Promise<void>;
  removeCustomTrack: (id: string) => Promise<void>;
  setCustomTracks: (tracks: CustomTrackItem[]) => void;
}

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
    (set, get) => ({
      currentVideoId: LOFI_CHANNELS[0].videoId,
      currentTitle: LOFI_CHANNELS[0].desc,
      isPlaying: false,
      volume: 75,
      isMuted: false,
      customTracks: [],

      setCustomTracks: (customTracks) => set({ customTracks }),

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
          const title = 'Custom Stream: ' + id;
          set({
            currentVideoId: id,
            currentTitle: title,
            isPlaying: true
          });
          // Also automatically add to user's tracks
          get().addCustomTrack(id, title);
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
      toggleMute: () => set(s => ({ isMuted: !s.isMuted })),

      addCustomTrack: async (youtubeId, title, channel = '') => {
        const tempId = Date.now().toString();
        const newTrack: CustomTrackItem = {
          id: tempId,
          youtubeId,
          title: title || `Track ${youtubeId}`,
          channel
        };

        // Don't duplicate same videoId
        const existing = get().customTracks.find(t => t.youtubeId === youtubeId);
        if (existing) return;

        set(s => ({ customTracks: [newTrack, ...s.customTracks] }));

        const { session } = useAuthStore.getState();
        if (session) {
          try {
            const res = await fetch(`${API_BASE_URL}/tracks`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.access_token}`
              },
              body: JSON.stringify({
                youtube_id: youtubeId,
                title: newTrack.title,
                channel: newTrack.channel
              })
            });
            if (res.ok) {
              const created = await res.json();
              set(s => ({
                customTracks: s.customTracks.map(t => t.id === tempId ? { ...t, id: created.id } : t)
              }));
            }
          } catch (e) {
            console.error('[Tracks API] Add failed:', e);
          }
        }
      },

      removeCustomTrack: async (id) => {
        set(s => ({
          customTracks: s.customTracks.filter(t => t.id !== id)
        }));

        const { session } = useAuthStore.getState();
        if (session) {
          try {
            await fetch(`${API_BASE_URL}/tracks/${id}`, {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${session.access_token}`
              }
            });
          } catch (e) {
            console.error('[Tracks API] Delete failed:', e);
          }
        }
      }
    }),
    {
      name: 'vibespace-youtube-store',
      partialize: (s) => ({
        currentVideoId: s.currentVideoId,
        currentTitle: s.currentTitle,
        volume: s.volume,
        isMuted: s.isMuted,
        customTracks: s.customTracks
      })
    }
  )
);
