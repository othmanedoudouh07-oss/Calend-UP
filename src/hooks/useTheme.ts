import { useEffect } from 'react';
import { useSettingsStore } from '@/stores/useSettingsStore';

export function useTheme() {
  const theme = useSettingsStore((s) => s.theme);
  const accent = useSettingsStore((s) => s.colorfulAccent);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'colorful', 'colorful-purple', 'colorful-blue', 'colorful-pink', 'colorful-green', 'colorful-orange');

    if (theme === 'auto') {
      const hour = new Date().getHours();
      if (hour >= 7 && hour < 19) {
        root.classList.add('colorful', `colorful-${accent}`);
      } else {
        root.classList.add('dark');
      }
    } else if (theme === 'colorful') {
      root.classList.add('colorful', `colorful-${accent}`);
    } else {
      root.classList.add(theme);
    }
  }, [theme, accent]);
}
