import { Info } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export const Legend = () => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-muted hover:bg-muted/80 transition-colors">
          <Info className="h-3 w-3 text-muted-foreground" />
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-64" align="start">
        <div className="space-y-2">
          <h4 className="text-sm font-medium leading-none">Legend</h4>
          <div className="grid gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-gradient-to-br from-rose-200 to-pink-300 shadow-sm flex-shrink-0"></div>
              <span className="text-muted-foreground">Light flow</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-gradient-to-br from-rose-400 to-pink-500 shadow-sm flex-shrink-0"></div>
              <span className="text-muted-foreground">Medium flow</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-red-500 border flex-shrink-0"></div>
              <span className="text-muted-foreground">Heavy flow</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm border-2 border-purple-300 bg-transparent flex-shrink-0"></div>
              <span className="text-muted-foreground">Symptoms</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
