import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Settings, ThemeMode, ColorfulAccent, NotificationLevel, Category, DEFAULT_CATEGORIES } from '@/types';

interface SettingsStore extends Settings {
  setTheme: (theme: ThemeMode) => void;
  setColorfulAccent: (accent: ColorfulAccent) => void;
  setNotificationLevel: (level: NotificationLevel) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setMorningDigestTime: (time: string) => void;
  setNotifByCategory: (catId: string, enabled: boolean) => void;
  setCategories: (cats: Category[]) => void;
  addCategory: (cat: Category) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  removeCategory: (id: string) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      theme: 'dark',
      colorfulAccent: 'purple',
      notificationLevel: 'normal',
      notificationsEnabled: true,
      morningDigestTime: '08:00',
      notifByCategory: {},
      categories: DEFAULT_CATEGORIES,
      setTheme: (theme) => set({ theme }),
      setColorfulAccent: (colorfulAccent) => set({ colorfulAccent }),
      setNotificationLevel: (level) => set({ notificationLevel: level }),
      setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
      setMorningDigestTime: (morningDigestTime) => set({ morningDigestTime }),
      setNotifByCategory: (catId, enabled) =>
        set((s) => ({ notifByCategory: { ...s.notifByCategory, [catId]: enabled } })),
      setCategories: (categories) => set({ categories }),
      addCategory: (cat) => set((s) => ({ categories: [...s.categories, cat] })),
      updateCategory: (id, updates) =>
        set((s) => ({ categories: s.categories.map((c) => (c.id === id ? { ...c, ...updates } : c)) })),
      removeCategory: (id) =>
        set((s) => ({ categories: s.categories.filter((c) => c.id !== id) })),
    }),
    { name: 'plansmart-settings' }
  )
);
