import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TodoItem } from '../types';
import confetti from 'canvas-confetti';
import { useAuthStore } from './useAuthStore';
import { API_BASE_URL } from '../lib/supabase';

interface TodoState {
  todos: TodoItem[];
  lastActiveDate: string; // YYYY-MM-DD

  // Actions
  addTodo: (text: string, isDaily?: boolean) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  toggleDaily: (id: string) => void;
  checkAndResetDaily: () => void;
  setTodos: (todos: TodoItem[]) => void;
}

const getTodayDateString = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const INITIAL_TODOS: TodoItem[] = [
  { id: '1', text: 'Deep work session 1 (Architecture)', completed: false, isDaily: false, createdAt: Date.now() },
  { id: '2', text: 'Review project requirements & specs', completed: true, isDaily: false, createdAt: Date.now() - 3600000, completedAt: Date.now() },
  { id: '3', text: 'Write Pomodoro timer Zustand store', completed: true, isDaily: false, createdAt: Date.now() - 1800000, completedAt: Date.now() },
  { id: '4', text: 'Stretch & drink water every break', completed: false, isDaily: true, createdAt: Date.now() },
  { id: '5', text: 'Set up GitHub repository VibeSpaceStudio', completed: true, isDaily: false, createdAt: Date.now() - 7200000, completedAt: Date.now() },
];

export const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      todos: INITIAL_TODOS,
      lastActiveDate: getTodayDateString(),

      setTodos: (todos) => set({ todos }),

      addTodo: async (text, isDaily = false) => {
        if (!text.trim()) return;
        const tempId = Date.now().toString();
        const newTodo: TodoItem = {
          id: tempId,
          text: text.trim(),
          completed: false,
          isDaily,
          createdAt: Date.now()
        };
        set(s => ({ todos: [newTodo, ...s.todos] }));

        // Cloud sync if authenticated
        const { session } = useAuthStore.getState();
        if (session) {
          try {
            const res = await fetch(`${API_BASE_URL}/todos`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.access_token}`
              },
              body: JSON.stringify({
                text: text.trim(),
                completed: false,
                is_routine: isDaily
              })
            });
            if (res.ok) {
              const created = await res.json();
              set(s => ({
                todos: s.todos.map(t => t.id === tempId ? { ...t, id: created.id } : t)
              }));
            }
          } catch (e) {
            console.error('[Todo API] Add failed:', e);
          }
        }
      },

      toggleTodo: async (id) => {
        const { todos } = get();
        let targetCompleted = false;
        const updated = todos.map(t => {
          if (t.id === id) {
            const nextCompleted = !t.completed;
            targetCompleted = nextCompleted;
            if (nextCompleted) {
              confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.7 }
              });
            }
            return {
              ...t,
              completed: nextCompleted,
              completedAt: nextCompleted ? Date.now() : undefined
            };
          }
          return t;
        });
        set({ todos: updated });

        // Cloud sync if authenticated
        const { session } = useAuthStore.getState();
        if (session) {
          try {
            await fetch(`${API_BASE_URL}/todos/${id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.access_token}`
              },
              body: JSON.stringify({ completed: targetCompleted })
            });
          } catch (e) {
            console.error('[Todo API] Toggle failed:', e);
          }
        }
      },

      deleteTodo: async (id) => {
        set(s => ({ todos: s.todos.filter(t => t.id !== id) }));

        // Cloud sync if authenticated
        const { session } = useAuthStore.getState();
        if (session) {
          try {
            await fetch(`${API_BASE_URL}/todos/${id}`, {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${session.access_token}`
              }
            });
          } catch (e) {
            console.error('[Todo API] Delete failed:', e);
          }
        }
      },

      toggleDaily: (id) => {
        set(s => ({
          todos: s.todos.map(t => t.id === id ? { ...t, isDaily: !t.isDaily } : t)
        }));
      },

      checkAndResetDaily: () => {
        const today = getTodayDateString();
        const { lastActiveDate, todos } = get();

        if (lastActiveDate !== today) {
          const resetTodos = todos.map(t => {
            if (t.isDaily) {
              return { ...t, completed: false, completedAt: undefined };
            }
            return t;
          });

          set({
            todos: resetTodos,
            lastActiveDate: today
          });
        }
      }
    }),
    {
      name: 'vibespace-todos-storage',
      partialize: (s) => ({
        todos: s.todos,
        lastActiveDate: s.lastActiveDate
      })
    }
  )
);
