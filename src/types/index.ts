export type CategoryId = 'sport' | 'work' | 'personal' | 'health' | 'other';

export interface Category {
  id: CategoryId | string;
  name: string;
  color: string; // tailwind class
  icon: string;
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'sport', name: 'Sport', color: 'bg-green-500', icon: '🏃' },
  { id: 'work', name: 'Travail', color: 'bg-blue-500', icon: '💼' },
  { id: 'personal', name: 'Personnel', color: 'bg-purple-500', icon: '🎯' },
  { id: 'health', name: 'Santé', color: 'bg-red-500', icon: '💊' },
  { id: 'other', name: 'Autre', color: 'bg-amber-500', icon: '📌' },
];

export type TaskStatus = 'pending' | 'completed' | 'postponed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  categoryId: string;
  date: string; // ISO date
  time?: string; // HH:mm
  duration?: number; // minutes
  status: TaskStatus;
  recurrence?: 'daily' | 'weekly' | 'custom';
  reminderMinutes?: number;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  categoryId: string;
  date: string;
  startTime: string;
  endTime: string;
  recurrence?: 'daily' | 'weekly' | 'custom';
  reminderMinutes?: number;
  createdAt: string;
}

export type MedicationFrequency = 'daily' | 'twice_daily' | 'three_times' | 'weekly' | 'custom';
export type IntakeStatus = 'taken' | 'missed' | 'postponed';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: MedicationFrequency;
  times: string[]; // HH:mm
  startDate: string;
  endDate?: string;
  notes?: string;
  color?: string;
  icon?: string;
  active: boolean;
  createdAt: string;
}

export interface MedicationIntake {
  id: string;
  medicationId: string;
  date: string;
  time: string;
  status: IntakeStatus;
  takenAt?: string;
}

export interface Routine {
  id: string;
  name: string;
  icon: string;
  tasks: Omit<Task, 'id' | 'date' | 'status' | 'createdAt'>[];
}

export type ThemeMode = 'dark' | 'colorful' | 'auto';
export type ColorfulAccent = 'purple' | 'blue' | 'pink' | 'green' | 'orange';
export type NotificationLevel = 'gentle' | 'normal' | 'strict';

export interface Settings {
  theme: ThemeMode;
  colorfulAccent: ColorfulAccent;
  notificationLevel: NotificationLevel;
  notificationsEnabled: boolean;
  morningDigestTime: string;
  notifByCategory: Record<string, boolean>;
  categories: Category[];
}
