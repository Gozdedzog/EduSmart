import { useEffect, useCallback } from 'react';

interface UseRealTimeUpdatesProps {
  onUpdate: () => void;
  interval?: number;
  enabled?: boolean;
}

export const useRealTimeUpdates = ({
  onUpdate,
  interval = 10000, // 10 saniye
  enabled = true
}: UseRealTimeUpdatesProps) => {
  const refresh = useCallback(() => {
    if (enabled) {
      onUpdate();
    }
  }, [onUpdate, enabled]);

  useEffect(() => {
    if (!enabled) return;

    const intervalId = setInterval(refresh, interval);
    
    // Sayfa görünür olduğunda da güncelle
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refresh();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refresh, interval, enabled]);

  return { refresh };
};
