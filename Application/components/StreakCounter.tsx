import { motion } from "motion/react";
import { Card, CardContent } from "./ui/card";

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
  totalSubmissions: number;
  lastSubmission: string | null;
}

export function StreakCounter({ 
  currentStreak, 
  longestStreak, 
  totalSubmissions, 
  lastSubmission 
}: StreakCounterProps) {
  const getSystemLevel = (streak: number) => {
    if (streak === 0) return "Inactive";
    if (streak <= 3) return "Initializing";
    if (streak <= 7) return "Processing";
    if (streak <= 14) return "Stable";
    if (streak <= 30) return "Optimized";
    return "Peak";
  };

  const getDaysToNextLevel = (streak: number) => {
    if (streak < 3) return 3 - streak;
    if (streak < 7) return 7 - streak;
    if (streak < 14) return 14 - streak;
    if (streak < 30) return 30 - streak;
    return null;
  };

  const nextLevelDays = getDaysToNextLevel(currentStreak);
  
  const isAtRisk = lastSubmission && 
    new Date().getTime() - new Date(lastSubmission).getTime() > 20 * 60 * 60 * 1000;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mx-auto">
      {/* Current Streak */}
      <Card className="border-border/50 bg-card">
        <CardContent className="p-6 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-12 h-12 border border-primary/50 bg-primary/10 flex items-center justify-center mb-4 mx-auto">
              <motion.div 
                className="w-6 h-6 border border-primary bg-primary/20"
                animate={{ 
                  opacity: currentStreak > 0 ? [0.5, 1, 0.5] : 0.3
                }}
                transition={{ duration: 2, repeat: currentStreak > 0 ? Infinity : 0 }}
              />
            </div>
            <motion.div 
              className="text-2xl font-mono mb-1 text-foreground/90"
              animate={{ scale: currentStreak > 0 ? [1, 1.05, 1] : 1 }}
              transition={{ duration: 1, repeat: currentStreak > 0 ? Infinity : 0, repeatDelay: 3 }}
            >
              {currentStreak.toString().padStart(3, '0')}
            </motion.div>
            <div className="text-xs text-muted-foreground mb-3 tracking-wide uppercase">Active Cycles</div>
            <div className="text-xs text-primary/80 border border-primary/20 bg-primary/5 px-2 py-1">
              {getSystemLevel(currentStreak)}
            </div>
          </motion.div>
          
          {isAtRisk && currentStreak > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-xs text-destructive/80 border border-destructive/20 bg-destructive/5 px-2 py-1"
            >
              System decay imminent
            </motion.div>
          )}
          
          {nextLevelDays && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 text-xs text-muted-foreground/70"
            >
              {nextLevelDays} cycles to next level
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Longest Streak */}
      <Card className="border-border/50 bg-card">
        <CardContent className="p-6 text-center">
          <div className="w-12 h-12 border border-primary/30 bg-primary/5 flex items-center justify-center mb-4 mx-auto">
            <div className="w-6 h-6 bg-primary/40" />
          </div>
          <div className="text-2xl font-mono mb-1 text-foreground/90">
            {longestStreak.toString().padStart(3, '0')}
          </div>
          <div className="text-xs text-muted-foreground mb-3 tracking-wide uppercase">Peak Performance</div>
          <div className="text-xs text-primary/60 border border-primary/15 bg-primary/3 px-2 py-1">
            Maximum Achieved
          </div>
          {currentStreak === longestStreak && currentStreak > 0 && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 text-xs text-primary border border-primary/30 bg-primary/10 px-2 py-1"
            >
              New record established
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Total Submissions */}
      <Card className="border-border/50 bg-card">
        <CardContent className="p-6 text-center">
          <div className="w-12 h-12 border border-primary/20 bg-primary/3 flex items-center justify-center mb-4 mx-auto">
            <div className="grid grid-cols-2 gap-px w-4 h-4">
              <div className="bg-primary/30 w-full h-full" />
              <div className="bg-primary/20 w-full h-full" />
              <div className="bg-primary/20 w-full h-full" />
              <div className="bg-primary/30 w-full h-full" />
            </div>
          </div>
          <div className="text-2xl font-mono mb-1 text-foreground/90">
            {totalSubmissions.toString().padStart(3, '0')}
          </div>
          <div className="text-xs text-muted-foreground mb-3 tracking-wide uppercase">Total Records</div>
          <div className="text-xs text-primary/60 border border-primary/15 bg-primary/3 px-2 py-1">
            {totalSubmissions === 0 ? "Initialize" :
             totalSubmissions < 10 ? "Building" :
             totalSubmissions < 30 ? "Expanding" :
             totalSubmissions < 100 ? "Established" : "Mastery"}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}