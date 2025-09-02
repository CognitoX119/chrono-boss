import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, TrendingUp, Target, Calendar } from "lucide-react";

interface TimeEntry {
  id: string;
  project: string;
  duration: number;
  description: string;
  date: Date;
}

interface AnalyticsCardsProps {
  entries: TimeEntry[];
}

export function AnalyticsCards({ entries }: AnalyticsCardsProps) {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Calculate today's time
  const today = new Date();
  const todayEntries = entries.filter(entry => 
    entry.date.toDateString() === today.toDateString()
  );
  const todayTotal = todayEntries.reduce((sum, entry) => sum + entry.duration, 0);

  // Calculate this week's time
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weekEntries = entries.filter(entry => entry.date >= weekStart);
  const weekTotal = weekEntries.reduce((sum, entry) => sum + entry.duration, 0);

  // Calculate average daily time this week
  const daysWithEntries = new Set(
    weekEntries.map(entry => entry.date.toDateString())
  ).size;
  const averageDaily = daysWithEntries > 0 ? weekTotal / daysWithEntries : 0;

  // Most productive project this week
  const projectTotals = weekEntries.reduce((acc, entry) => {
    acc[entry.project] = (acc[entry.project] || 0) + entry.duration;
    return acc;
  }, {} as Record<string, number>);

  const topProject = Object.entries(projectTotals).sort(([,a], [,b]) => b - a)[0];

  const stats = [
    {
      title: "Today",
      value: formatDuration(todayTotal),
      icon: Calendar,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "This Week",
      value: formatDuration(weekTotal),
      icon: Clock,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Daily Average",
      value: formatDuration(averageDaily),
      icon: TrendingUp,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Top Project",
      value: topProject ? topProject[0] : "None yet",
      icon: Target,
      color: "text-accent",
      bgColor: "bg-accent/10",
      subtitle: topProject ? formatDuration(topProject[1]) : "",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
                {stat.subtitle && (
                  <p className="text-xs text-muted-foreground">
                    {stat.subtitle}
                  </p>
                )}
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}