import { useEffect } from 'react';
import { useTodoStore } from '../stores/useTodoStore';

export const useDailyReset = () => {
  const { checkAndResetDaily } = useTodoStore();

  useEffect(() => {
    // Check immediately on app load
    checkAndResetDaily();

    // Check periodically every minute
    const interval = setInterval(() => {
      checkAndResetDaily();
    }, 60000);

    return () => clearInterval(interval);
  }, [checkAndResetDaily]);
};

