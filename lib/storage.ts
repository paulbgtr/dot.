import {
  AppData,
  UserProfile,
  PeriodDay,
  CycleData,
  DEFAULT_SYMPTOMS,
} from "./types";

const STORAGE_KEY = "period-tracker-data";
const STORAGE_VERSION = "1.0.0";

// Default user profile
const DEFAULT_PROFILE: UserProfile = {
  averageCycleLength: 28,
  averagePeriodLength: 5,
  symptoms: DEFAULT_SYMPTOMS,
  createdAt: new Date().toISOString(),
  lastUpdated: new Date().toISOString(),
};

// Default app data structure
const DEFAULT_APP_DATA: AppData = {
  profile: DEFAULT_PROFILE,
  periods: [],
  cycles: [],
  version: STORAGE_VERSION,
};

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined";

export class PeriodStorage {
  private static instance: PeriodStorage;
  private data: AppData;

  private constructor() {
    this.data = this.loadData();
  }

  public static getInstance(): PeriodStorage {
    if (!PeriodStorage.instance) {
      PeriodStorage.instance = new PeriodStorage();
    }
    return PeriodStorage.instance;
  }

  private loadData(): AppData {
    if (!isBrowser) {
      return { ...DEFAULT_APP_DATA };
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return { ...DEFAULT_APP_DATA };
      }

      const parsed = JSON.parse(stored) as AppData;

      // Validate and migrate data if necessary
      if (!parsed.version || parsed.version !== STORAGE_VERSION) {
        return this.migrateData(parsed);
      }

      return parsed;
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      return { ...DEFAULT_APP_DATA };
    }
  }

  private migrateData(
    oldData: Partial<AppData> & Record<string, unknown>,
  ): AppData {
    // Handle data migration for future versions
    // For now, just merge with defaults
    return {
      ...DEFAULT_APP_DATA,
      ...oldData,
      version: STORAGE_VERSION,
    };
  }

  private saveData(): void {
    if (!isBrowser) return;

    try {
      this.data.profile.lastUpdated = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (error) {
      console.error("Error saving data to localStorage:", error);
    }
  }

  // Get all data
  public getData(): AppData {
    return { ...this.data };
  }

  // Profile methods
  public getProfile(): UserProfile {
    return { ...this.data.profile };
  }

  public updateProfile(updates: Partial<UserProfile>): void {
    this.data.profile = { ...this.data.profile, ...updates };
    this.saveData();
  }

  // Period day methods
  public getPeriodDays(): PeriodDay[] {
    return [...this.data.periods];
  }

  public getPeriodDay(date: string): PeriodDay | undefined {
    return this.data.periods.find((p) => p.date === date);
  }

  public addOrUpdatePeriodDay(periodDay: PeriodDay): void {
    const existingIndex = this.data.periods.findIndex(
      (p) => p.date === periodDay.date,
    );

    if (existingIndex >= 0) {
      this.data.periods[existingIndex] = periodDay;
    } else {
      this.data.periods.push(periodDay);
      // Keep periods sorted by date
      this.data.periods.sort((a, b) => a.date.localeCompare(b.date));
    }

    this.saveData();
    this.updateCycles();
  }

  public removePeriodDay(date: string): void {
    this.data.periods = this.data.periods.filter((p) => p.date !== date);
    this.saveData();
    this.updateCycles();
  }

  // Cycle methods
  public getCycles(): CycleData[] {
    return [...this.data.cycles];
  }

  private updateCycles(): void {
    // Recalculate cycles based on period data
    const periodDays = this.data.periods
      .filter((p) => p.flow !== "none")
      .sort((a, b) => a.date.localeCompare(b.date));

    if (periodDays.length === 0) {
      this.data.cycles = [];
      return;
    }

    const cycles: CycleData[] = [];
    let currentCycleStart: string | null = null;
    let lastPeriodDate: string | null = null;

    for (const periodDay of periodDays) {
      const currentDate = new Date(periodDay.date);

      if (!currentCycleStart) {
        currentCycleStart = periodDay.date;
        lastPeriodDate = periodDay.date;
        continue;
      }

      const lastDate = new Date(lastPeriodDate!);
      const daysBetween = Math.floor(
        (currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      // If more than 10 days between periods, consider it a new cycle
      if (daysBetween > 10) {
        cycles.push({
          startDate: currentCycleStart,
          endDate: lastPeriodDate,
          length:
            Math.floor(
              (lastDate.getTime() - new Date(currentCycleStart).getTime()) /
                (1000 * 60 * 60 * 24),
            ) + 1,
        });

        currentCycleStart = periodDay.date;
      }

      lastPeriodDate = periodDay.date;
    }

    // Add the current ongoing cycle
    if (currentCycleStart) {
      cycles.push({
        startDate: currentCycleStart,
        endDate: lastPeriodDate || undefined,
        length: lastPeriodDate
          ? Math.floor(
              (new Date(lastPeriodDate).getTime() -
                new Date(currentCycleStart).getTime()) /
                (1000 * 60 * 60 * 24),
            ) + 1
          : undefined,
      });
    }

    this.data.cycles = cycles;
  }

  // Data management methods
  public exportData(): string {
    const exportData = {
      exportDate: new Date().toISOString(),
      data: this.data,
    };
    return JSON.stringify(exportData, null, 2);
  }

  public importData(jsonData: string): boolean {
    try {
      const importData = JSON.parse(jsonData);

      // Validate the imported data structure
      if (
        !importData.data ||
        !importData.data.profile ||
        !importData.data.periods
      ) {
        throw new Error("Invalid data format");
      }

      this.data = {
        ...DEFAULT_APP_DATA,
        ...importData.data,
        version: STORAGE_VERSION,
      };

      this.saveData();
      return true;
    } catch (error) {
      console.error("Error importing data:", error);
      return false;
    }
  }

  public clearAllData(): void {
    this.data = { ...DEFAULT_APP_DATA };
    this.saveData();
  }

  // Utility methods
  public getNextPredictedPeriod(): Date | null {
    const cycles = this.getCycles();
    if (cycles.length === 0) return null;

    const lastCycle = cycles[cycles.length - 1];
    if (!lastCycle.startDate) return null;

    const averageCycleLength = this.data.profile.averageCycleLength;
    const lastCycleStart = new Date(lastCycle.startDate);

    return new Date(
      lastCycleStart.getTime() + averageCycleLength * 24 * 60 * 60 * 1000,
    );
  }

  public isDayInPeriod(date: string): boolean {
    const periodDay = this.getPeriodDay(date);
    return periodDay ? periodDay.flow !== "none" : false;
  }

  public getDayData(date: string) {
    const periodDay = this.getPeriodDay(date);
    return {
      date,
      isPeriod: periodDay ? periodDay.flow !== "none" : false,
      flow: periodDay?.flow || "none",
      symptoms: periodDay?.symptoms || [],
      notes: periodDay?.notes || "",
    };
  }
}

export const storage = PeriodStorage.getInstance();
