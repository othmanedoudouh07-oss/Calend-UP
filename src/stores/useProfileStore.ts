import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SportGoal = 'lose_weight' | 'gain_weight' | 'maintain' | 'endurance' | 'muscle' | 'flexibility';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type Gender = 'male' | 'female' | 'other';

export interface SportProfile {
  goal: SportGoal;
  frequency: number; // sessions per week
  preferredActivities: string[];
  activityLevel: ActivityLevel;
  targetWeight?: number;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: Gender | '';
  height: number; // cm
  weight: number; // kg
  sportEnabled: boolean;
  sport: SportProfile;
}

interface ProfileStore {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateSport: (updates: Partial<SportProfile>) => void;
  setSportEnabled: (enabled: boolean) => void;
}

const defaultProfile: UserProfile = {
  firstName: '',
  lastName: '',
  birthDate: '',
  gender: '',
  height: 0,
  weight: 0,
  sportEnabled: false,
  sport: {
    goal: 'maintain',
    frequency: 3,
    preferredActivities: [],
    activityLevel: 'moderate',
  },
};

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      profile: defaultProfile,
      updateProfile: (updates) =>
        set((s) => ({ profile: { ...s.profile, ...updates } })),
      updateSport: (updates) =>
        set((s) => ({
          profile: { ...s.profile, sport: { ...s.profile.sport, ...updates } },
        })),
      setSportEnabled: (enabled) =>
        set((s) => ({ profile: { ...s.profile, sportEnabled: enabled } })),
    }),
    { name: 'plansmart-profile' }
  )
);
