import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Medication, MedicationIntake } from '@/types';

interface HealthStore {
  medications: Medication[];
  intakes: MedicationIntake[];
  addMedication: (med: Medication) => void;
  updateMedication: (id: string, updates: Partial<Medication>) => void;
  deleteMedication: (id: string) => void;
  addIntake: (intake: MedicationIntake) => void;
  updateIntake: (id: string, updates: Partial<MedicationIntake>) => void;
}

export const useHealthStore = create<HealthStore>()(
  persist(
    (set) => ({
      medications: [],
      intakes: [],
      addMedication: (med) => set((s) => ({ medications: [...s.medications, med] })),
      updateMedication: (id, updates) =>
        set((s) => ({
          medications: s.medications.map((m) => (m.id === id ? { ...m, ...updates } : m)),
        })),
      deleteMedication: (id) =>
        set((s) => ({ medications: s.medications.filter((m) => m.id !== id) })),
      addIntake: (intake) => set((s) => ({ intakes: [...s.intakes, intake] })),
      updateIntake: (id, updates) =>
        set((s) => ({
          intakes: s.intakes.map((i) => (i.id === id ? { ...i, ...updates } : i)),
        })),
    }),
    { name: 'plansmart-health' }
  )
);
