import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const Legend = () => {
  return (
    <Card className="mt-6 fade-in">
      <CardHeader>
        <CardTitle className="text-sm">Legend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-rose-200 to-pink-300 shadow-sm"></div>
            <span className="text-muted-foreground">Light flow</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-rose-400 to-pink-500 shadow-sm"></div>
            <span className="text-muted-foreground">Medium flow</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500 border"></div>
            <span className="text-muted-foreground">Heavy flow</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-purple-300 bg-transparent"></div>
            <span className="text-muted-foreground">Symptoms</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
