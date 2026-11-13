import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SoundTrack, SoundPreset } from '../types';
import { audioEngine } from '../utils/audioSynth';

const DEFAULT_TRACKS: SoundTrack[] = [
  { id: 'rain', name: 'Rain', icon: 'CloudRain', category: 'nature', volume: 0.6, isPlaying: false },
  { id: 'thunder', name: 'Thunder', icon: 'CloudLightning', category: 'nature', volume: 0.5, isPlaying: false },
  { id: 'campfire', name: 'Campfire', icon: 'Flame', category: 'nature', volume: 0.6, isPlaying: false },
  { id: 'wind', name: 'Forest Wind', icon: 'Wind', category: 'nature', volume: 0.5, isPlaying: false },
  { id: 'waves', name: 'Ocean Waves', icon: 'Waves', category: 'nature', volume: 0.55, isPlaying: false },
  { id: 'coffee', name: 'Coffee Shop', icon: 'Coffee', category: 'urban', volume: 0.45, isPlaying: false },
  { id: 'keyboard', name: 'Keyboard', icon: 'Keyboard', category: 'urban', volume: 0.4, isPlaying: false },
  { id: 'stream', name: 'Stream', icon: 'Droplets', category: 'nature', volume: 0.5, isPlaying: false },
  { id: 'birds', name: 'Birds', icon: 'Bird', category: 'nature', volume: 0.45, isPlaying: false },
  { id: 'whitenoise', name: 'Pink Noise', icon: 'Activity', category: 'ambient', volume: 0.5, isPlaying: false },
];

export const PRESETS: SoundPreset[] = [
  {
    id: 'rainy-night',
    name: 'Rainy Night',
    icon: '🌧',
    tracks: [
      { id: 'rain', volume: 0.7 },
      { id: 'thunder', volume: 0.4 },
      { id: 'campfire', volume: 0.5 }
    ]
  },
  {
    id: 'deep-forest',
    name: 'Forest Cabin',
    icon: '🌲',
    tracks: [
      { id: 'wind', volume: 0.6 },
      { id: 'birds', volume: 0.5 },
      { id: 'campfire', volume: 0.55 }
    ]
  },
  {
    id: 'cozy-coffee',
    name: 'Cozy Cafe',
    icon: '☕',
    tracks: [
      { id: 'coffee', volume: 0.6 },
      { id: 'rain', volume: 0.4 },
      { id: 'keyboard', volume: 0.35 }
    ]
  },
  {
    id: 'ocean-dusk',
    name: 'Ocean Dusk',
    icon: '🌊',
    tracks: [
      { id: 'waves', volume: 0.7 },
      { id: 'wind', volume: 0.4 }
    ]
  },
  {
    id: 'deep-focus',
    name: 'Deep Focus',
    icon: '✨',
    tracks: [
      { id: 'whitenoise', volume: 0.5 },
      { id: 'stream', volume: 0.45 }
    ]
  }
];

interface MixerState {
  masterVolume: number;
  isMuted: boolean;
  tracks: SoundTrack[];

  // Actions
  toggleTrack: (id: string) => void;
  setTrackVolume: (id: string, volume: number) => void;
  setMasterVolume: (volume: number) => void;
  toggleMasterMute: () => void;
  applyPreset: (presetId: string) => void;
  stopAll: () => void;
  activeCount: () => number;
}

export const useMixerStore = create<MixerState>()(
  persist(
    (set, get) => ({
      masterVolume: 0.8,
      isMuted: false,
      tracks: DEFAULT_TRACKS,

      toggleTrack: (id) => {
        const { tracks, isMuted, masterVolume } = get();
        const updated = tracks.map((t) => {
          if (t.id === id) {
            const nextState = !t.isPlaying;
            if (nextState && !isMuted) {
              audioEngine.startSound(t.id, t.volume * masterVolume);
            } else {
              audioEngine.stopSound(t.id);
            }
            return { ...t, isPlaying: nextState };
          }
          return t;
        });
        set({ tracks: updated });
      },

      setTrackVolume: (id, volume) => {
        const { tracks, isMuted, masterVolume } = get();
        const updated = tracks.map((t) => {
          if (t.id === id) {
            if (t.isPlaying && !isMuted) {
              audioEngine.setTrackVolume(t.id, volume * masterVolume);
            }
            return { ...t, volume };
          }
          return t;
        });
        set({ tracks: updated });
      },

      setMasterVolume: (volume) => {
        audioEngine.setMasterVolume(get().isMuted ? 0 : volume);
        set({ masterVolume: volume });
      },

      toggleMasterMute: () => {
        const { isMuted, masterVolume, tracks } = get();
        const nextMuted = !isMuted;
        audioEngine.setMasterVolume(nextMuted ? 0 : masterVolume);

        if (nextMuted) {
          audioEngine.stopAll();
        } else {
          // Restart currently active tracks
          tracks.filter(t => t.isPlaying).forEach(t => {
            audioEngine.startSound(t.id, t.volume * masterVolume);
          });
        }
        set({ isMuted: nextMuted });
      },

      applyPreset: (presetId) => {
        const preset = PRESETS.find(p => p.id === presetId);
        if (!preset) return;
        const { tracks, masterVolume, isMuted } = get();
        audioEngine.stopAll();

        const updated = tracks.map(t => {
          const match = preset.tracks.find(pt => pt.id === t.id);
          if (match) {
            if (!isMuted) {
              audioEngine.startSound(t.id, match.volume * masterVolume);
            }
            return { ...t, isPlaying: true, volume: match.volume };
          }
          return { ...t, isPlaying: false };
        });

        set({ tracks: updated, isMuted: false });
      },

      stopAll: () => {
        audioEngine.stopAll();
        const updated = get().tracks.map(t => ({ ...t, isPlaying: false }));
        set({ tracks: updated });
      },

      activeCount: () => {
        return get().tracks.filter(t => t.isPlaying).length;
      }
    }),
    {
      name: 'vibespace-mixer-store',
      partialize: (s) => ({
        masterVolume: s.masterVolume,
        tracks: s.tracks.map(t => ({ id: t.id, volume: t.volume, isPlaying: false }))
      })
    }
  )
);

