"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  Plus,
  Trash2,
  Search,
  X,
  Droplets,
  Calendar,
  NotebookPen,
} from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { storage } from "@/lib/storage";
import { FlowIntensity, PeriodDay } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DayEditorProps {
  date: Date | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
}

const FLOW_OPTIONS: {
  value: FlowIntensity;
  label: string;
  description: string;
  color: string;
  bgColor: string;
  icon: string;
}[] = [
  {
    value: "none",
    label: "No flow",
    description: "No menstrual flow",
    color: "text-muted-foreground",
    bgColor: "bg-muted/30 hover:bg-muted/50",
    icon: "○",
  },
  {
    value: "light",
    label: "Light",
    description: "Light flow",
    color: "text-red-600",
    bgColor: "bg-red-50 hover:bg-red-100 border-red-200",
    icon: "●",
  },
  {
    value: "medium",
    label: "Medium",
    description: "Medium flow",
    color: "text-red-700",
    bgColor: "bg-red-100 hover:bg-red-200 border-red-300",
    icon: "●●",
  },
  {
    value: "heavy",
    label: "Heavy",
    description: "Heavy flow",
    color: "text-red-800",
    bgColor: "bg-red-200 hover:bg-red-300 border-red-400",
    icon: "●●●",
  },
];

function FlowSelector({
  value,
  onChange,
}: {
  value: FlowIntensity;
  onChange: (value: FlowIntensity) => void;
}) {
  return (
    <Card className="border-0 bg-card/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Droplets className="h-4 w-4 text-primary" />
          Flow Intensity
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-2">
          {FLOW_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                "group relative flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all duration-200 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                value === option.value
                  ? `${option.bgColor} ${option.color} border-current shadow-sm`
                  : "border-border hover:border-border/80 bg-background hover:bg-accent/50",
              )}
            >
              <span className="text-lg font-mono leading-none">
                {option.icon}
              </span>
              <div className="text-center">
                <div className="text-sm font-medium leading-none">
                  {option.label}
                </div>
              </div>
              {value === option.value && (
                <div className="absolute inset-0 rounded-lg ring-2 ring-primary/20" />
              )}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function SymptomsSelector({
  symptoms,
  availableSymptoms,
  onToggle,
  onAdd,
}: {
  symptoms: string[];
  availableSymptoms: string[];
  onToggle: (symptom: string) => void;
  onAdd: (symptom: string) => void;
}) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [customSymptom, setCustomSymptom] = React.useState("");

  const filteredSymptoms = availableSymptoms.filter((symptom) =>
    symptom.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAddCustomSymptom = () => {
    const trimmed = customSymptom.trim();
    if (
      trimmed &&
      !availableSymptoms.includes(trimmed) &&
      !symptoms.includes(trimmed)
    ) {
      onAdd(trimmed);
      setCustomSymptom("");
    }
  };

  return (
    <Card className="border-0 bg-card/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <NotebookPen className="h-4 w-4 text-primary" />
          Symptoms
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Search */}
        {availableSymptoms.length > 5 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search symptoms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {/* Symptoms List */}
        <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
          {filteredSymptoms.length === 0 && searchQuery ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No symptoms found matching "{searchQuery}"
            </p>
          ) : (
            filteredSymptoms.map((symptom) => (
              <div
                key={symptom}
                className="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/50 transition-colors group"
              >
                <Checkbox
                  id={symptom}
                  checked={symptoms.includes(symptom)}
                  onCheckedChange={() => onToggle(symptom)}
                  className="group-hover:border-primary/50"
                />
                <label
                  htmlFor={symptom}
                  className="text-sm leading-none cursor-pointer flex-1 group-hover:text-primary transition-colors"
                >
                  {symptom}
                </label>
              </div>
            ))
          )}
        </div>

        {/* Add Custom Symptom */}
        <div className="pt-2 border-t border-border/50">
          <div className="flex gap-2">
            <Input
              placeholder="Add custom symptom..."
              value={customSymptom}
              onChange={(e) => setCustomSymptom(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCustomSymptom();
                }
              }}
              className="flex-1"
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleAddCustomSymptom}
              disabled={
                !customSymptom.trim() ||
                availableSymptoms.includes(customSymptom.trim()) ||
                symptoms.includes(customSymptom.trim())
              }
              className="shrink-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Selected Count */}
        {symptoms.length > 0 && (
          <div className="text-xs text-muted-foreground">
            {symptoms.length} symptom{symptoms.length !== 1 ? "s" : ""} selected
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function NotesEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Card className="border-0 bg-card/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <NotebookPen className="h-4 w-4 text-primary" />
          Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Textarea
          className="min-h-[100px]"
          placeholder="Any additional notes about your day..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
          <span>Optional</span>
          <span>{value.length} characters</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function DayEditor({ date, isOpen, onClose, onSave }: DayEditorProps) {
  const [flow, setFlow] = React.useState<FlowIntensity>("none");
  const [symptoms, setSymptoms] = React.useState<string[]>([]);
  const [notes, setNotes] = React.useState("");
  const [availableSymptoms, setAvailableSymptoms] = React.useState<string[]>(
    [],
  );
  const [isLoading, setIsLoading] = React.useState(false);

  const dateString = date ? format(date, "yyyy-MM-dd") : "";
  const displayDate = date ? format(date, "EEEE, MMMM d, yyyy") : "";
  const hasExistingData = date && storage.getPeriodDay(dateString);

  React.useEffect(() => {
    if (!date) return;

    setIsLoading(true);

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

    setIsLoading(false);
  }, [date, dateString]);

  const handleSymptomToggle = (symptom: string) => {
    setSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom],
    );
  };

  const handleAddCustomSymptom = (symptom: string) => {
    setSymptoms((prev) => [...prev, symptom]);

    // Add to profile symptoms
    const profile = storage.getProfile();
    storage.updateProfile({
      symptoms: [...profile.symptoms, symptom],
    });
    setAvailableSymptoms((prev) => [...prev, symptom]);
  };

  const handleSave = async () => {
    if (!date) return;

    setIsLoading(true);

    try {
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!date) return;

    setIsLoading(true);

    try {
      storage.removePeriodDay(dateString);

      // Dispatch custom event to update calendar
      window.dispatchEvent(new CustomEvent("period-data-updated"));

      onSave?.();
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Day Editor
          </DialogTitle>
          <DialogDescription className="text-base font-medium">
            {displayDate}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 pr-2 -mr-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <FlowSelector value={flow} onChange={setFlow} />

              <SymptomsSelector
                symptoms={symptoms}
                availableSymptoms={availableSymptoms}
                onToggle={handleSymptomToggle}
                onAdd={handleAddCustomSymptom}
              />

              <NotesEditor value={notes} onChange={setNotes} />
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex justify-between items-center pt-6 border-t border-border/50">
          <div>
            {hasExistingData && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isLoading}
                className="gap-1.5"
              >
                <Trash2 className="h-4 w-4" />
                Delete Entry
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={isLoading}
              className="gap-1.5 min-w-[80px]"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
