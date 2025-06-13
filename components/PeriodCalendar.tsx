"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { storage } from "@/lib/storage";
import { parseISO } from "date-fns";

interface PeriodCalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  className?: string;
}

export function PeriodCalendar({
  selectedDate,
  onDateSelect,
  className,
}: PeriodCalendarProps) {
  const [periodDays, setPeriodDays] = React.useState(storage.getPeriodDays());

  React.useEffect(() => {
    const updatePeriodDays = () => {
      setPeriodDays(storage.getPeriodDays());
    };

    // Listen for storage changes
    window.addEventListener("storage", updatePeriodDays);

    // Custom event for local updates
    window.addEventListener("period-data-updated", updatePeriodDays);

    return () => {
      window.removeEventListener("storage", updatePeriodDays);
      window.removeEventListener("period-data-updated", updatePeriodDays);
    };
  }, []);

  const getDayModifiers = React.useMemo(() => {
    const modifiers: Record<string, Date[]> = {
      light: [],
      medium: [],
      heavy: [],
      symptoms: [],
    };

    periodDays.forEach((day) => {
      const date = parseISO(day.date);

      if (day.flow !== "none") {
        modifiers[day.flow].push(date);
      }

      if (day.symptoms.length > 0) {
        modifiers.symptoms.push(date);
      }
    });

    return modifiers;
  }, [periodDays]);

  const getDayClassNames = React.useMemo(() => {
    return {
      light:
        "rounded-xl hover:opacity-75 bg-gradient-to-br from-rose-200 to-pink-300 text-rose-800 hover:from-rose-300 hover:to-pink-400 shadow-sm",
      medium:
        "rounded-xl hover:opacity-75 bg-gradient-to-br from-rose-400 to-pink-500 text-white hover:from-rose-500 hover:to-pink-600 shadow-md font-medium",
      heavy:
        "rounded-xl hover:opacity-75 bg-gradient-to-br from-rose-600 to-pink-700 text-white hover:from-rose-700 hover:to-pink-800 shadow-lg font-semibold",
      symptoms:
        "rounded-xl hover:opacity-75 ring-4 ring-purple-400 ring-inset bg-purple-50 hover:bg-purple-100",
    };
  }, []);

  const handleDateSelect = (date: Date | undefined) => {
    if (date && onDateSelect) {
      onDateSelect(date);
    }
  };

  return (
    <div className={className}>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleDateSelect}
        modifiers={getDayModifiers}
        modifiersClassNames={getDayClassNames}
        className="w-full rounded-xl border shadow-sm"
        captionLayout="dropdown"
        fromYear={2020}
        toYear={2030}
      />
    </div>
  );
}
