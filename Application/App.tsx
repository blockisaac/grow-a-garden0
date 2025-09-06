import { useState, useEffect } from "react";
import { FlowerGarden } from "./components/FlowerGarden";
import { DailySubmission } from "./components/DailySubmission";
import { StreakCounter } from "./components/StreakCounter";
import { ActivityCalendar } from "./components/ActivityCalendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Toaster } from "./components/ui/sonner";

interface ActivityEntry {
  task: string;
  note: string;
  timestamp: string;
}

interface AppState {
  submissions: Record<string, ActivityEntry>;
  currentStreak: number;
  longestStreak: number;
}

const STORAGE_KEY = "flower_garden_data";

export default function App() {
  const [state, setState] = useState<AppState>({
    submissions: {},
    currentStreak: 0,
    longestStreak: 0
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setState(parsed);
      } catch (error) {
        console.error("Error loading saved data:", error);
      }
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Calculate streaks
  const calculateStreaks = (submissions: Record<string, ActivityEntry>) => {
    const dates = Object.keys(submissions).sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
    
    if (dates.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    // Current streak calculation
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if there's a submission today
    const todayKey = today.toDateString();
    let checkDate = new Date(today);
    
    if (submissions[todayKey]) {
      currentStreak = 1;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // If no submission today, check if yesterday had a submission
      checkDate.setDate(checkDate.getDate() - 1);
      const yesterdayKey = checkDate.toDateString();
      if (!submissions[yesterdayKey]) {
        // No recent activity, streak is broken
        return { currentStreak: 0, longestStreak: Math.max(...calculateAllStreaks(submissions)) };
      }
    }

    // Continue counting backwards
    while (submissions[checkDate.toDateString()]) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Calculate longest streak
    const allStreaks = calculateAllStreaks(submissions);
    const longestStreak = Math.max(currentStreak, ...allStreaks);

    return { currentStreak, longestStreak };
  };

  const calculateAllStreaks = (submissions: Record<string, ActivityEntry>) => {
    const dates = Object.keys(submissions).map(d => new Date(d)).sort((a, b) => a.getTime() - b.getTime());
    const streaks = [];
    let currentStreak = 1;

    for (let i = 1; i < dates.length; i++) {
      const prevDate = dates[i - 1];
      const currentDate = dates[i];
      const diffTime = currentDate.getTime() - prevDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        currentStreak++;
      } else {
        streaks.push(currentStreak);
        currentStreak = 1;
      }
    }
    streaks.push(currentStreak);
    return streaks.length > 0 ? streaks : [0];
  };

  const handleSubmission = (entry: ActivityEntry) => {
    const dateKey = new Date().toDateString();
    
    setState(prevState => {
      const newSubmissions = {
        ...prevState.submissions,
        [dateKey]: entry
      };
      
      const { currentStreak, longestStreak } = calculateStreaks(newSubmissions);
      
      return {
        submissions: newSubmissions,
        currentStreak,
        longestStreak
      };
    });
  };

  const hasSubmittedToday = () => {
    const todayKey = new Date().toDateString();
    return !!state.submissions[todayKey];
  };

  const getLastSubmission = () => {
    const dates = Object.keys(state.submissions).sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
    return dates.length > 0 ? dates[0] : null;
  };

  const totalSubmissions = Object.keys(state.submissions).length;

  return (
    <div className="min-h-screen bg-background p-8 dark">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl tracking-wide text-primary mb-4">
            Growth Protocol
          </h1>
          <div className="w-24 h-px bg-primary/30 mx-auto"></div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="garden" className="space-y-16">
          <TabsList className="grid w-full grid-cols-3 max-w-sm mx-auto bg-card border border-border">
            <TabsTrigger value="garden" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Monitor</TabsTrigger>
            <TabsTrigger value="submit" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Input</TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Archive</TabsTrigger>
          </TabsList>

          <TabsContent value="garden" className="space-y-16">
            <FlowerGarden 
              streakCount={state.currentStreak}
              lastSubmission={getLastSubmission()}
            />
            
            <StreakCounter
              currentStreak={state.currentStreak}
              longestStreak={state.longestStreak}
              totalSubmissions={totalSubmissions}
              lastSubmission={getLastSubmission()}
            />
          </TabsContent>

          <TabsContent value="submit" className="space-y-16">
            <DailySubmission
              onSubmission={handleSubmission}
              hasSubmittedToday={hasSubmittedToday()}
            />
            
            <div className="text-center">
              <div className="text-sm text-muted-foreground">
                Active streak: {state.currentStreak}
              </div>
              <div className="w-12 h-px bg-primary/20 mx-auto mt-2"></div>
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-16">
            <ActivityCalendar submissions={state.submissions} />
            
            <div className="text-center">
              <div className="text-sm text-muted-foreground">
                Historical data visualization
              </div>
              <div className="w-16 h-px bg-primary/20 mx-auto mt-2"></div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center mt-24">
          <div className="text-xs text-muted-foreground/60">
            Consistency maintains system integrity
          </div>
        </div>
      </div>
      
      <Toaster />
    </div>
  );
}