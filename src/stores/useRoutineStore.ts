import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Routine } from '@/types';

interface RoutineStore {
  routines: Routine[];
  addRoutine: (routine: Routine) => void;
  updateRoutine: (id: string, updates: Partial<Routine>) => void;
  deleteRoutine: (id: string) => void;
}

export const useRoutineStore = create<RoutineStore>()(
  persist(
    (set) => ({
      routines: [],
      addRoutine: (routine) => set((s) => ({ routines: [...s.routines, routine] })),
      updateRoutine: (id, updates) =>
        set((s) => ({
          routines: s.routines.map((r) => (r.id === id ? { ...r, ...updates } : r)),
        })),
      deleteRoutine: (id) =>
        set((s) => ({ routines: s.routines.filter((r) => r.id !== id) })),
    }),
    { name: 'plansmart-routines' }
  )
);
