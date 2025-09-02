import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Clock } from "lucide-react";

interface TimeEntry {
  id: string;
  project: string;
  duration: number;
  description: string;
  date: Date;
}

interface TimeEntriesProps {
  entries: TimeEntry[];
  onDeleteEntry: (id: string) => void;
}

export function TimeEntries({ entries, onDeleteEntry }: TimeEntriesProps) {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const todayEntries = entries.filter(entry => 
    entry.date.toDateString() === new Date().toDateString()
  );

  const yesterdayEntries = entries.filter(entry => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return entry.date.toDateString() === yesterday.toDateString();
  });

  const olderEntries = entries.filter(entry => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return entry.date < yesterday;
  });

  const EntryGroup = ({ title, entries }: { title: string; entries: TimeEntry[] }) => {
    if (entries.length === 0) return null;

    return (
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          {title}
        </h3>
        <div className="space-y-2">
          {entries.map((entry) => (
            <div 
              key={entry.id} 
              className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:border-primary/30 transition-colors group"
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="font-medium">
                    {entry.project}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {formatTime(entry.date)}
                  </span>
                </div>
                {entry.description && (
                  <p className="text-sm text-muted-foreground">
                    {entry.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-primary font-semibold">
                  <Clock className="w-4 h-4" />
                  {formatDuration(entry.duration)}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteEntry(entry.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-primary">Recent Time Entries</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {entries.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No time entries yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Start tracking your time to see entries here
            </p>
          </div>
        ) : (
          <>
            <EntryGroup title="Today" entries={todayEntries} />
            <EntryGroup title="Yesterday" entries={yesterdayEntries} />
            <EntryGroup title="Older" entries={olderEntries} />
          </>
        )}
      </CardContent>
    </Card>
  );
}