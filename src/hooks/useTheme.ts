import { useEffect } from 'react';
import { useSettingsStore } from '@/stores/useSettingsStore';

export function useTheme() {
  const theme = useSettingsStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'colorful');

    if (theme === 'auto') {
      const hour = new Date().getHours();
      root.classList.add(hour >= 7 && hour < 19 ? 'colorful' : 'dark');
    } else {
      root.classList.add(theme);
    }
  }, [theme]);
}
