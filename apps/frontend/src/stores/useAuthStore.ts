import { create } from 'zustand';
import { supabase, API_BASE_URL } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  display_name: string;
  avatar_url: string;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  isSyncing: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  syncWithCloud: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  isLoading: true,
  isAuthModalOpen: false,
  isSyncing: false,

  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        set({ session, user: session.user });
        // Fetch profile from backend
        try {
          const res = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${session.access_token}` }
          });
          if (res.ok) {
            const data = await res.json();
            set({ profile: data.profile });
          }
        } catch {
          // fallback
        }
      }
    } finally {
      set({ isLoading: false });
    }

    supabase.auth.onAuthStateChange(async (_event, session) => {
      set({ session, user: session?.user || null });
      if (session) {
        get().syncWithCloud();
      } else {
        set({ profile: null });
      }
    });
  },

  signIn: async (email, password) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { error: error.message };
      }

      set({ session: data.session, user: data.user, isAuthModalOpen: false });
      await get().syncWithCloud();
      return {};
    } catch (err: any) {
      return { error: err.message };
    } finally {
      set({ isLoading: false });
    }
  },

  signUp: async (email, password, displayName) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: displayName || email.split('@')[0]
          }
        }
      });

      if (error) {
        return { error: error.message };
      }

      if (data.session) {
        set({ session: data.session, user: data.user, isAuthModalOpen: false });
        await get().syncWithCloud();
      }
      return {};
    } catch (err: any) {
      return { error: err.message };
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null, profile: null });
  },

  syncWithCloud: async () => {
    const { session } = get();
    if (!session) return;
    set({ isSyncing: true });

    try {
      // Gather local storage data
      let localTracks: any[] = [];
      let localWallpapers: any[] = [];
      let localTodos: any[] = [];

      try {
        const youtubeData = localStorage.getItem('vibespace-youtube');
        if (youtubeData) {
          const parsed = JSON.parse(youtubeData);
          if (parsed.state?.customChannels) {
            localTracks = parsed.state.customChannels.map((c: any) => ({
              youtube_id: c.videoId || c.id,
              title: c.name || c.title || 'Custom Track',
              channel: c.description || ''
            }));
          }
        }
      } catch {}

      try {
        const wpData = localStorage.getItem('vibespace-wallpapers');
        if (wpData) {
          const parsed = JSON.parse(wpData);
          if (parsed.state?.wallpapers) {
            localWallpapers = parsed.state.wallpapers
              .filter((w: any) => w.isCustom)
              .map((w: any) => ({
                title: w.title,
                url: w.url,
                type: w.type || 'image'
              }));
          }
        }
      } catch {}

      try {
        const todoData = localStorage.getItem('vibespace-todos');
        if (todoData) {
          const parsed = JSON.parse(todoData);
          if (parsed.state?.todos) {
            localTodos = parsed.state.todos.map((t: any) => ({
              text: t.text,
              completed: !!t.completed,
              is_routine: !!t.isRoutine
            }));
          }
        }
      } catch {}

      const res = await fetch(`${API_BASE_URL}/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          tracks: localTracks,
          wallpapers: localWallpapers,
          todos: localTodos
        })
      });

      if (res.ok) {
        const { data } = await res.json();
        console.log('[Cloud Sync] Successfully synced with Supabase:', data);
      }
    } catch (e) {
      console.error('[Cloud Sync] Failed:', e);
    } finally {
      set({ isSyncing: false });
    }
  }
}));

