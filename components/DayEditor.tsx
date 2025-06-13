"use client";

import * as React from "react";
import { format } from "date-fns";
import { Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { storage } from "@/lib/storage";
import { FlowIntensity, PeriodDay } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DayEditorProps {
  date: Date | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
}

const FLOW_OPTIONS: { value: FlowIntensity; label: string; color: string }[] = [
  { value: "none", label: "No flow", color: "transparent" },
  { value: "light", label: "Light flow", color: "bg-red-100 text-red-800" },
  { value: "medium", label: "Medium flow", color: "bg-red-300 text-red-900" },
  { value: "heavy", label: "Heavy flow", color: "bg-red-500 text-white" },
];

export function DayEditor({ date, isOpen, onClose, onSave }: DayEditorProps) {
  const [flow, setFlow] = React.useState<FlowIntensity>("none");
  const [symptoms, setSymptoms] = React.useState<string[]>([]);
  const [notes, setNotes] = React.useState("");
  const [customSymptom, setCustomSymptom] = React.useState("");
  const [availableSymptoms, setAvailableSymptoms] = React.useState<string[]>(
    [],
  );

  const dateString = date ? format(date, "yyyy-MM-dd") : "";
  const displayDate = date ? format(date, "MMMM d, yyyy") : "";

  React.useEffect(() => {
    if (!date) return;

    // Load existing data for this date
    const existingData = storage.getPeriodDay(dateString);
    if (existingData) {
      setFlow(existingData.flow);
      setSymptoms(existingData.symptoms);
      setNotes(existingData.notes || "");
    } else {
      // Reset to defaults
      setFlow("none");
      setSymptoms([]);
      setNotes("");
    }

    // Load available symptoms from profile
    const profile = storage.getProfile();
    setAvailableSymptoms(profile.symptoms);
  }, [date, dateString]);

  const handleFlowChange = (newFlow: FlowIntensity) => {
    setFlow(newFlow);
  };

  const handleSymptomToggle = (symptom: string) => {
    setSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom],
    );
  };

  const handleAddCustomSymptom = () => {
    const trimmed = customSymptom.trim();
    if (
      trimmed &&
      !availableSymptoms.includes(trimmed) &&
      !symptoms.includes(trimmed)
    ) {
      setSymptoms((prev) => [...prev, trimmed]);

      // Add to profile symptoms
      const profile = storage.getProfile();
      storage.updateProfile({
        symptoms: [...profile.symptoms, trimmed],
      });
      setAvailableSymptoms((prev) => [...prev, trimmed]);

      setCustomSymptom("");
    }
  };

  const handleSave = () => {
    if (!date) return;

    const periodDay: PeriodDay = {
      date: dateString,
      flow,
      symptoms,
      notes: notes.trim(),
    };

    storage.addOrUpdatePeriodDay(periodDay);

    // Dispatch custom event to update calendar
    window.dispatchEvent(new CustomEvent("period-data-updated"));

    onSave?.();
    onClose();
  };

  const handleDelete = () => {
    if (!date) return;

    storage.removePeriodDay(dateString);

    // Dispatch custom event to update calendar
    window.dispatchEvent(new CustomEvent("period-data-updated"));

    onSave?.();
    onClose();
  };

  const hasExistingData = date && storage.getPeriodDay(dateString);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Day</DialogTitle>
          <DialogDescription>{displayDate}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Flow Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Flow intensity</label>
            <div className="grid grid-cols-2 gap-2">
              {FLOW_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleFlowChange(option.value)}
                  className={cn(
                    "p-3 rounded-lg border text-sm font-medium transition-all",
                    flow === option.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50",
                    option.color !== "transparent" &&
                      flow === option.value &&
                      option.color,
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Symptoms */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Symptoms</label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {availableSymptoms.map((symptom) => (
                <div key={symptom} className="flex items-center space-x-2">
                  <Checkbox
                    id={symptom}
                    checked={symptoms.includes(symptom)}
                    onCheckedChange={() => handleSymptomToggle(symptom)}
                  />
                  <label
                    htmlFor={symptom}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {symptom}
                  </label>
                </div>
              ))}
            </div>

            {/* Add custom symptom */}
            <div className="flex gap-2">
              <Input
                placeholder="Add custom symptom"
                value={customSymptom}
                onChange={(e) => setCustomSymptom(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustomSymptom();
                  }
                }}
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleAddCustomSymptom}
                disabled={!customSymptom.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Notes</label>
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Any additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4">
          <div>
            {hasExistingData && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
