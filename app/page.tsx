"use client";

import * as React from "react";
import { Calendar, TrendingUp } from "lucide-react";
import { PeriodCalendar } from "@/components/PeriodCalendar";
import { DayEditor } from "@/components/DayEditor";
import { storage } from "@/lib/storage";
import { Header } from "@/components/Header";
import { LogToday } from "@/components/LogToday";
import { Legend } from "@/components/Legend";

interface CycleStats {
  nextPredictedPeriod: Date | null;
  daysSinceLastPeriod: number | null;
  currentCycleDay: number | null;
  averageCycleLength: number;
}

export default function PeriodTracker() {
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [isDayEditorOpen, setIsDayEditorOpen] = React.useState(false);
  const [stats, setStats] = React.useState<CycleStats>({
    nextPredictedPeriod: null,
    daysSinceLastPeriod: null,
    currentCycleDay: null,
    averageCycleLength: 28,
  });

  const updateStats = React.useCallback(() => {
    const profile = storage.getProfile();
    const cycles = storage.getCycles();
    const periodDays = storage.getPeriodDays();

    let nextPredictedPeriod: Date | null = null;
    let daysSinceLastPeriod: number | null = null;
    let currentCycleDay: number | null = null;

    // Find the last period
    const lastPeriodDays = periodDays
      .filter((day) => day.flow !== "none")
      .sort((a, b) => b.date.localeCompare(a.date));

    if (lastPeriodDays.length > 0) {
      const lastPeriodDate = new Date(lastPeriodDays[0].date);
      const today = new Date();

      daysSinceLastPeriod = Math.floor(
        (today.getTime() - lastPeriodDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      // Calculate current cycle day
      const lastCycle = cycles[cycles.length - 1];
      if (lastCycle && lastCycle.startDate) {
        const cycleStartDate = new Date(lastCycle.startDate);
        currentCycleDay =
          Math.floor(
            (today.getTime() - cycleStartDate.getTime()) /
              (1000 * 60 * 60 * 24),
          ) + 1;
      }

      // Predict next period
      nextPredictedPeriod = new Date(
        lastPeriodDate.getTime() +
          profile.averageCycleLength * 24 * 60 * 60 * 1000,
      );
    }

    setStats({
      nextPredictedPeriod,
      daysSinceLastPeriod,
      currentCycleDay,
      averageCycleLength: profile.averageCycleLength,
    });
  }, []);

  React.useEffect(() => {
    updateStats();

    const handleDataUpdate = () => {
      updateStats();
    };

    window.addEventListener("period-data-updated", handleDataUpdate);
    return () => {
      window.removeEventListener("period-data-updated", handleDataUpdate);
    };
  }, [updateStats]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setIsDayEditorOpen(true);
  };

  const handleCloseDayEditor = () => {
    setIsDayEditorOpen(false);
    setSelectedDate(null);
  };

  const handleQuickAddToday = () => {
    setSelectedDate(new Date());
    setIsDayEditorOpen(true);
  };

  const getDaysUntilNextPeriod = () => {
    if (!stats.nextPredictedPeriod) return null;
    const today = new Date();
    const daysUntil = Math.ceil(
      (stats.nextPredictedPeriod.getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24),
    );
    return daysUntil > 0 ? daysUntil : null;
  };

  const daysUntilNext = getDaysUntilNextPeriod();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {stats.daysSinceLastPeriod !== null && (
            <div className="period-card stats-card-period rounded-lg p-4 fade-in">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-rose-600" />
                <span className="text-sm font-medium text-rose-700">
                  Days Since Last Period
                </span>
              </div>
              <div className="text-2xl font-bold text-rose-800">
                {stats.daysSinceLastPeriod}
              </div>
            </div>
          )}

          {daysUntilNext !== null && (
            <div className="period-card stats-card-prediction rounded-lg p-4 fade-in">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">
                  Next Period In
                </span>
              </div>
              <div className="text-2xl font-bold text-emerald-800">
                {daysUntilNext} {daysUntilNext === 1 ? "day" : "days"}
              </div>
            </div>
          )}

          {stats.currentCycleDay !== null && (
            <div className="period-card stats-card-cycle rounded-lg p-4 fade-in">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">
                  Current Cycle Day
                </span>
              </div>
              <div className="text-2xl font-bold text-purple-800">
                Day {stats.currentCycleDay}
              </div>
            </div>
          )}
        </div>

        <PeriodCalendar
          selectedDate={selectedDate || undefined}
          onDateSelect={handleDateSelect}
          className="w-full"
        />

        <Legend />
      </div>

      {/* Day Editor Modal */}
      <DayEditor
        date={selectedDate}
        isOpen={isDayEditorOpen}
        onClose={handleCloseDayEditor}
        onSave={updateStats}
      />

      <LogToday handleQuickAddToday={handleQuickAddToday} />
    </div>
  );
}
