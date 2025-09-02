import { Clock } from "lucide-react";

export function Header() {
  return (
    <header className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-foreground/20 rounded-lg">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">TimeTracker Pro</h1>
              <p className="text-primary-foreground/80 text-sm">
                Freelancer Time Management System
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-primary-foreground/80">
              {new Date().toLocaleDateString([], { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}