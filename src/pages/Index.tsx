import { useState } from "react";
import { Header } from "@/components/Header";
import { TimerCard } from "@/components/TimerCard";
import { TimeEntries } from "@/components/TimeEntries";
import { AnalyticsCards } from "@/components/AnalyticsCards";

interface TimeEntry {
  id: string;
  project: string;
  duration: number;
  description: string;
  date: Date;
}

const Index = () => {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);

  const addTimeEntry = (entry: Omit<TimeEntry, 'id'>) => {
    const newEntry = {
      ...entry,
      id: Date.now().toString(),
    };
    setTimeEntries(prev => [newEntry, ...prev]);
  };

  const deleteTimeEntry = (id: string) => {
    setTimeEntries(prev => prev.filter(entry => entry.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30">
      <Header />
      
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Analytics Cards */}
        <AnalyticsCards entries={timeEntries} />

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Timer Card */}
          <TimerCard onTimeEntry={addTimeEntry} />

          {/* Time Entries */}
          <TimeEntries 
            entries={timeEntries} 
            onDeleteEntry={deleteTimeEntry}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
