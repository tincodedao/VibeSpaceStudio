import { useEffect } from 'react';
import { usePomodoroStore } from '../stores/usePomodoroStore';
import { useUIStore } from '../stores/useUIStore';

export const useKeyboardShortcuts = () => {
  const { toggleTimer } = usePomodoroStore();
  const { isZenMode, toggleZenMode, setZenMode, closeDrawer, activeDrawer, toggleFullscreen } = useUIStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        toggleTimer();
      } else if (e.key === 'z' || e.key === 'Z') {
        e.preventDefault();
        toggleZenMode();
      } else if (e.key === 'Escape') {
        if (isZenMode) {
          setZenMode(false);
        } else if (activeDrawer !== 'none') {
          closeDrawer();
        }
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleTimer, isZenMode, toggleZenMode, setZenMode, closeDrawer, activeDrawer, toggleFullscreen]);
};

