import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TodoItem } from '../types';
import confetti from 'canvas-confetti';

interface TodoState {
  todos: TodoItem[];
  lastActiveDate: string; // YYYY-MM-DD

  // Actions
  addTodo: (text: string, isDaily?: boolean) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  toggleDaily: (id: string) => void;
  checkAndResetDaily: () => void;
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

      addTodo: (text, isDaily = false) => {
        if (!text.trim()) return;
        const newTodo: TodoItem = {
          id: Date.now().toString(),
          text: text.trim(),
          completed: false,
          isDaily,
          createdAt: Date.now()
        };
        set(s => ({ todos: [newTodo, ...s.todos] }));
      },

      toggleTodo: (id) => {
        const { todos } = get();
        const updated = todos.map(t => {
          if (t.id === id) {
            const nextCompleted = !t.completed;
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
      },

      deleteTodo: (id) => {
        set(s => ({ todos: s.todos.filter(t => t.id !== id) }));
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
          // It's a new day!
          // Daily tasks are uncompleted, one-off completed tasks are cleared
          const refreshed = todos
            .filter(t => t.isDaily || !t.completed)
            .map(t => t.isDaily ? { ...t, completed: false, completedAt: undefined } : t);

          set({
            todos: refreshed,
            lastActiveDate: today
          });
        }
      }
    }),
    {
      name: 'vibespace-todo-store'
    }
  )
);

