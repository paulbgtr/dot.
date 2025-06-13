// Types for period tracking application

export interface PeriodDay {
  date: string; // ISO date string (YYYY-MM-DD)
  flow: 'none' | 'light' | 'medium' | 'heavy';
  symptoms: string[];
  notes?: string;
}

export interface CycleData {
  startDate: string; // ISO date string
  endDate?: string; // ISO date string, undefined if cycle is ongoing
  length?: number; // calculated cycle length in days
}

export interface UserProfile {
  averageCycleLength: number; // default 28
  averagePeriodLength: number; // default 5
  symptoms: string[]; // custom symptoms list
  createdAt: string; // ISO date string
  lastUpdated: string; // ISO date string
}

export interface AppData {
  profile: UserProfile;
  periods: PeriodDay[];
  cycles: CycleData[];
  version: string; // for data migration if needed
}

export type FlowIntensity = 'none' | 'light' | 'medium' | 'heavy';

export interface DayData {
  date: string;
  isPeriod: boolean;
  flow?: FlowIntensity;
  symptoms: string[];
  notes?: string;
}

// Predefined symptom options
export const DEFAULT_SYMPTOMS = [
  'Cramps',
  'Headache',
  'Mood swings',
  'Bloating',
  'Fatigue',
  'Nausea',
  'Tender breasts',
  'Acne',
  'Back pain',
  'Constipation',
  'Diarrhea',
  'Food cravings',
  'Irritability',
  'Anxiety',
  'Insomnia'
];

// Flow intensity colors for UI
export const FLOW_COLORS = {
  none: 'transparent',
  light: '#fecaca', // light red
  medium: '#f87171', // medium red
  heavy: '#dc2626' // dark red
} as const;

// Export data format
export interface ExportData {
  exportDate: string;
  data: AppData;
}
