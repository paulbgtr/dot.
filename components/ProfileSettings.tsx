"use client";

import * as React from "react";
import { Settings, Download, Upload, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { storage } from "@/lib/storage";
import { UserProfile } from "@/lib/types";

export function ProfileSettings() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [profile, setProfile] = React.useState<UserProfile>(
    storage.getProfile(),
  );
  const [averageCycleLength, setAverageCycleLength] = React.useState(
    profile.averageCycleLength.toString(),
  );
  const [averagePeriodLength, setAveragePeriodLength] = React.useState(
    profile.averagePeriodLength.toString(),
  );

  React.useEffect(() => {
    if (isOpen) {
      const currentProfile = storage.getProfile();
      setProfile(currentProfile);
      setAverageCycleLength(currentProfile.averageCycleLength.toString());
      setAveragePeriodLength(currentProfile.averagePeriodLength.toString());
    }
  }, [isOpen]);

  const handleSave = () => {
    const cycleLength = parseInt(averageCycleLength);
    const periodLength = parseInt(averagePeriodLength);

    if (isNaN(cycleLength) || cycleLength < 21 || cycleLength > 35) {
      alert("Cycle length must be between 21 and 35 days");
      return;
    }

    if (isNaN(periodLength) || periodLength < 3 || periodLength > 10) {
      alert("Period length must be between 3 and 10 days");
      return;
    }

    storage.updateProfile({
      averageCycleLength: cycleLength,
      averagePeriodLength: periodLength,
    });

    // Dispatch custom event to update other components
    window.dispatchEvent(new CustomEvent("period-data-updated"));

    setIsOpen(false);
  };

  const handleExportData = () => {
    const exportData = storage.exportData();
    const blob = new Blob([exportData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `period-tracker-export-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  };

  const handleImportData = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const success = storage.importData(content);

          if (success) {
            alert("Data imported successfully!");
            window.dispatchEvent(new CustomEvent("period-data-updated"));
            setIsOpen(false);
          } else {
            alert("Failed to import data. Please check the file format.");
          }
        } catch {
          alert("Error reading file. Please ensure it's a valid JSON file.");
        }
      };
      reader.readAsText(file);
    };

    input.click();
  };

  const handleClearAllData = () => {
    if (
      confirm(
        "Are you sure you want to delete all your data? This action cannot be undone.",
      )
    ) {
      storage.clearAllData();
      alert("All data has been cleared.");
      window.dispatchEvent(new CustomEvent("period-data-updated"));
      setIsOpen(false);
    }
  };

  const cycles = storage.getCycles();
  const totalCycles = cycles.filter((c) => c.length).length;
  const averageActualCycleLength =
    totalCycles > 0
      ? Math.round(
          cycles
            .filter((c) => c.length)
            .reduce((sum, c) => sum + (c.length || 0), 0) / totalCycles,
        )
      : null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settings & Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">
              Cycle Preferences
            </h3>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Average Cycle Length (days)
              </label>
              <Input
                type="number"
                min="21"
                max="35"
                value={averageCycleLength}
                onChange={(e) => setAverageCycleLength(e.target.value)}
                placeholder="28"
              />
              <p className="text-xs text-muted-foreground">
                Typical range: 21-35 days
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Average Period Length (days)
              </label>
              <Input
                type="number"
                min="3"
                max="10"
                value={averagePeriodLength}
                onChange={(e) => setAveragePeriodLength(e.target.value)}
                placeholder="5"
              />
              <p className="text-xs text-muted-foreground">
                Typical range: 3-10 days
              </p>
            </div>

            {averageActualCycleLength && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">Your Statistics</p>
                <p className="text-xs text-muted-foreground">
                  Based on {totalCycles} recorded cycles, your average cycle
                  length is {averageActualCycleLength} days
                </p>
              </div>
            )}
          </div>

          {/* Data Management */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">
              Data Management
            </h3>

            <div className="grid grid-cols-1 gap-2">
              <Button
                variant="outline"
                onClick={handleExportData}
                className="justify-start"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>

              <Button
                variant="outline"
                onClick={handleImportData}
                className="justify-start"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import Data
              </Button>

              <Button
                variant="destructive"
                onClick={handleClearAllData}
                className="justify-start"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All Data
              </Button>
            </div>
          </div>

          {/* App Info */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground">About</h3>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Period Tracker v1.0.0</p>
              <p>All data is stored locally on your device</p>
              <p>No data is shared with external servers</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
