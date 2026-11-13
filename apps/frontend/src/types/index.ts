export type PomodoroMode = 'focus' | 'shortBreak' | 'longBreak';

export interface SoundTrack {
  id: string;
  name: string;
  icon: string;
  category: 'nature' | 'urban' | 'ambient';
  volume: number; // 0 to 1
  isPlaying: boolean;
}

export interface SoundPreset {
  id: string;
  name: string;
  icon: string;
  tracks: { id: string; volume: number }[];
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  isDaily: boolean;
  createdAt: number;
  completedAt?: number;
}

export interface Wallpaper {
  id: string;
  title: string;
  category: 'forest' | 'ocean' | 'mountains' | 'galaxy' | 'cozy' | 'minimal';
  url: string;
  thumbnail: string;
}

