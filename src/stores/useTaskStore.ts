import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, Event } from '@/types';

export interface DailyRecurring {
  id: string;
  title: string;
  categoryId: string;
  time: string; // HH:mm
  permanent: boolean; // true = no end date
  startDate: string;
  endDate?: string; // only if not permanent
  active: boolean;
  createdAt: string;
}

interface TaskStore {
  tasks: Task[];
  events: Event[];
  dailyRecurrings: DailyRecurring[];
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addEvent: (event: Event) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  addDailyRecurring: (r: DailyRecurring) => void;
  updateDailyRecurring: (id: string, updates: Partial<DailyRecurring>) => void;
  deleteDailyRecurring: (id: string) => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [],
      events: [],
      dailyRecurrings: [],
      addTask: (task) => set((s) => ({ tasks: [...s.tasks, task] })),
      updateTask: (id, updates) =>
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),
      deleteTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
      addEvent: (event) => set((s) => ({ events: [...s.events, event] })),
      updateEvent: (id, updates) =>
        set((s) => ({
          events: s.events.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        })),
      deleteEvent: (id) => set((s) => ({ events: s.events.filter((e) => e.id !== id) })),
      addDailyRecurring: (r) => set((s) => ({ dailyRecurrings: [...s.dailyRecurrings, r] })),
      updateDailyRecurring: (id, updates) =>
        set((s) => ({
          dailyRecurrings: s.dailyRecurrings.map((r) => (r.id === id ? { ...r, ...updates } : r)),
        })),
      deleteDailyRecurring: (id) =>
        set((s) => ({ dailyRecurrings: s.dailyRecurrings.filter((r) => r.id !== id) })),
    }),
    { name: 'plansmart-tasks' }
  )
);
