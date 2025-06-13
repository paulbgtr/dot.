import { Button } from "./ui/button";
import { Plus } from "lucide-react";

export const LogToday = ({
  handleQuickAddToday,
}: {
  handleQuickAddToday: () => void;
}) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      <Button
        onClick={handleQuickAddToday}
        size="lg"
        className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground px-6 py-3 h-auto"
      >
        <Plus className="h-5 w-5 mr-2 transition-transform group-hover:rotate-90 duration-300" />
        <span className="font-medium">Log Today</span>
      </Button>
    </div>
  );
};
