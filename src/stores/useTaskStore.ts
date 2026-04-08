import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, Event } from '@/types';

interface TaskStore {
  tasks: Task[];
  events: Event[];
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addEvent: (event: Event) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [],
      events: [],
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
    }),
    { name: 'plansmart-tasks' }
  )
);
