import React, { useState } from 'react';
import { X, Check, Trash2, Repeat, Plus, Calendar } from 'lucide-react';
import { useTodoStore } from '../stores/useTodoStore';
import { useUIStore } from '../stores/useUIStore';

export const TodoDrawer: React.FC = () => {
  const { todos, addTodo, toggleTodo, deleteTodo, toggleDaily } = useTodoStore();
  const { activeDrawer, closeDrawer } = useUIStore();
  const [inputText, setInputText] = useState('');
  const [isDailySelected, setIsDailySelected] = useState(false);

  const isOpen = activeDrawer === 'todo';

  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    addTodo(inputText, isDailySelected);
    setInputText('');
  };

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  if (!isOpen) return null;

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-full sm:w-[390px] glass-panel border-r border-white/10 shadow-2xl flex flex-col transition-all duration-300 animate-in slide-in-from-left">
      {/* Header */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold text-on-surface">Daily Tasks</h2>
          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mt-0.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{todayStr}</span>
          </div>
        </div>
        <button
          onClick={closeDrawer}
          className="p-1.5 rounded-full hover:bg-white/10 text-on-surface-variant hover:text-on-surface transition-colors"
          title="Close drawer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Metric Card */}
      <div className="p-5 border-b border-white/10 bg-surface-container-high/30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-on-surface">Daily Progress</span>
          <span className="text-xs font-semibold text-primary">
            {completedCount}/{totalCount} done ({percentage}%)
          </span>
        </div>
        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-container to-secondary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Quick Add Input */}
      <form onSubmit={handleAdd} className="p-4 border-b border-white/10">
        <div className="relative">
          <input
            type="text"
            placeholder="Add task for today... [Press Enter]"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full px-4 py-2.5 pr-20 text-xs rounded-xl bg-surface-container-high/60 border border-white/10 text-on-surface focus:border-primary focus:outline-none placeholder-white/30"
          />
          <div className="absolute right-1.5 top-1.5 flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsDailySelected(!isDailySelected)}
              className={`p-1.5 rounded-lg text-[10px] flex items-center gap-1 transition-colors ${
                isDailySelected
                  ? 'bg-secondary/20 text-secondary'
                  : 'text-on-surface-variant hover:bg-white/10'
              }`}
              title="Repeat daily"
            >
              <Repeat className="w-3 h-3" />
            </button>
            <button
              type="submit"
              className="p-1.5 rounded-lg bg-primary-container text-on-primary-container hover:brightness-110 transition-colors"
              title="Add task"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </form>

      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {todos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center text-on-surface-variant">
            <span className="text-3xl mb-2">🌿</span>
            <p className="text-xs font-medium">All tasks cleared for today!</p>
            <p className="text-[11px] opacity-70 mt-1">Enjoy your mindful flow.</p>
          </div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              onClick={() => toggleTodo(todo.id)}
              className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer group ${
                todo.completed
                  ? 'bg-surface-container-low/30 border-white/5 opacity-60'
                  : 'bg-surface-container/60 border-white/10 hover:border-white/20 hover:bg-surface-container-high/60'
              }`}
            >
              {/* Checkbox */}
              <div
                className={`w-5 h-5 rounded-full border transition-all flex items-center justify-center flex-shrink-0 ${
                  todo.completed
                    ? 'border-secondary bg-secondary text-black'
                    : 'border-white/30 group-hover:border-primary'
                }`}
              >
                {todo.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>

              {/* Task Text & Badges */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-xs transition-colors truncate ${
                    todo.completed ? 'line-through text-on-surface-variant' : 'text-on-surface'
                  }`}
                >
                  {todo.text}
                </p>
                {todo.isDaily && (
                  <span className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.2 rounded-full bg-secondary/15 text-secondary font-medium mt-1">
                    <Repeat className="w-2.5 h-2.5" /> Daily Routine
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDaily(todo.id);
                  }}
                  className="p-1 rounded hover:bg-white/10 text-on-surface-variant hover:text-secondary transition-colors"
                  title={todo.isDaily ? 'Remove from daily' : 'Set as daily habit'}
                >
                  <Repeat className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTodo(todo.id);
                  }}
                  className="p-1 rounded hover:bg-white/10 text-on-surface-variant hover:text-red-400 transition-colors"
                  title="Delete task"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Midnight Reset Notice */}
      <div className="p-4 border-t border-white/10 text-center bg-surface-container-low/40">
        <p className="text-[11px] text-on-surface-variant opacity-75">
          ✨ Tasks automatically reset at 00:00 midnight for a fresh daily start.
        </p>
      </div>
    </aside>
  );
};

