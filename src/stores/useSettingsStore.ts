import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Settings, ThemeMode, NotificationLevel, Category, DEFAULT_CATEGORIES } from '@/types';

interface SettingsStore extends Settings {
  setTheme: (theme: ThemeMode) => void;
  setNotificationLevel: (level: NotificationLevel) => void;
  setCategories: (cats: Category[]) => void;
  addCategory: (cat: Category) => void;
  removeCategory: (id: string) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      theme: 'dark',
      notificationLevel: 'normal',
      categories: DEFAULT_CATEGORIES,
      setTheme: (theme) => set({ theme }),
      setNotificationLevel: (level) => set({ notificationLevel: level }),
      setCategories: (categories) => set({ categories }),
      addCategory: (cat) => set((s) => ({ categories: [...s.categories, cat] })),
      removeCategory: (id) =>
        set((s) => ({ categories: s.categories.filter((c) => c.id !== id) })),
    }),
    { name: 'plansmart-settings' }
  )
);
