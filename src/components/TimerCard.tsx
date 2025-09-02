import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Play, Pause, Square, Plus } from "lucide-react";

interface Project {
  id: string;
  name: string;
  color: string;
}

interface TimerCardProps {
  onTimeEntry: (entry: { project: string; duration: number; description: string; date: Date }) => void;
}

export function TimerCard({ onTimeEntry }: TimerCardProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [description, setDescription] = useState("");
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  const [projects, setProjects] = useState<Project[]>([
    { id: "1", name: "Website Redesign", color: "#3b82f6" },
    { id: "2", name: "Mobile App", color: "#10b981" },
    { id: "3", name: "Marketing Campaign", color: "#f59e0b" },
  ]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isPaused]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (!selectedProject) return;
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    if (seconds > 0 && selectedProject) {
      onTimeEntry({
        project: projects.find(p => p.id === selectedProject)?.name || "",
        duration: seconds,
        description,
        date: new Date(),
      });
    }
    setIsRunning(false);
    setIsPaused(false);
    setSeconds(0);
    setDescription("");
  };

  const addProject = () => {
    if (newProjectName.trim()) {
      const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
      const newProject = {
        id: Date.now().toString(),
        name: newProjectName,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
      setProjects([...projects, newProject]);
      setSelectedProject(newProject.id);
      setNewProjectName("");
      setShowNewProject(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-background to-secondary/20 border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-primary">Time Tracker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-6xl font-mono font-bold text-foreground mb-4">
            {formatTime(seconds)}
          </div>
          <div className="flex justify-center gap-3">
            {!isRunning ? (
              <Button 
                onClick={handleStart} 
                disabled={!selectedProject}
                className="bg-success hover:bg-success/90 text-success-foreground px-8 py-3 text-lg font-semibold rounded-full shadow-md transition-all duration-200 hover:shadow-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Start
              </Button>
            ) : (
              <>
                <Button 
                  onClick={handlePause}
                  variant="outline"
                  className="px-8 py-3 text-lg font-semibold rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                >
                  {isPaused ? <Play className="w-5 h-5 mr-2" /> : <Pause className="w-5 h-5 mr-2" />}
                  {isPaused ? "Resume" : "Pause"}
                </Button>
                <Button 
                  onClick={handleStop}
                  variant="destructive"
                  className="px-8 py-3 text-lg font-semibold rounded-full shadow-md transition-all duration-200 hover:shadow-lg"
                >
                  <Square className="w-5 h-5 mr-2" />
                  Stop
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Project
            </label>
            {!showNewProject ? (
              <div className="flex gap-2">
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger className="border-2 border-border hover:border-primary transition-colors">
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: project.color }}
                          />
                          {project.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setShowNewProject(true)}
                  className="border-2 border-border hover:border-primary transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter project name"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addProject()}
                  className="border-2 border-border focus:border-primary"
                />
                <Button onClick={addProject} disabled={!newProjectName.trim()}>
                  Add
                </Button>
                <Button variant="outline" onClick={() => setShowNewProject(false)}>
                  Cancel
                </Button>
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Description (optional)
            </label>
            <Input
              placeholder="What are you working on?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isRunning}
              className="border-2 border-border focus:border-primary transition-colors"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}