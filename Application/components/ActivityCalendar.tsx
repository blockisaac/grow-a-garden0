import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

interface ActivityEntry {
  task: string;
  note: string;
  timestamp: string;
}

interface ActivityCalendarProps {
  submissions: Record<string, ActivityEntry>;
}

export function ActivityCalendar({ submissions }: ActivityCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateKey = (year: number, month: number, day: number) => {
    return new Date(year, month, day).toDateString();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day && 
           today.getMonth() === currentDate.getMonth() && 
           today.getFullYear() === currentDate.getFullYear();
  };

  const hasSubmission = (day: number) => {
    const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day);
    return submissions[dateKey];
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-7" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const submission = hasSubmission(day);
      const today = isToday(day);
      
      days.push(
        <motion.div
          key={day}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: day * 0.005 }}
          className={`
            h-7 w-7 border flex items-center justify-center text-xs relative cursor-pointer font-mono
            transition-all duration-300 hover:scale-105
            ${today ? 'border-primary bg-primary/10 text-primary' : ''}
            ${submission ? 'border-primary/60 bg-primary/20 text-primary' : 'border-border/30 text-muted-foreground/60'}
            ${submission && today ? 'border-primary bg-primary/30' : ''}
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={
            submission 
              ? `Data: ${submission.task}${submission.note ? '\nNotes: ' + submission.note : ''}`
              : today 
                ? "Current cycle - Input required"
                : "No data recorded"
          }
        >
          {day.toString().padStart(2, '0')}
          {submission && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-px -right-px w-1.5 h-1.5 bg-primary"
            />
          )}
        </motion.div>
      );
    }

    return days;
  };

  const monthNames = [
    "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
  ];

  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

  const submissionCount = Object.keys(submissions).filter(dateKey => {
    const date = new Date(dateKey);
    return date.getMonth() === currentDate.getMonth() && 
           date.getFullYear() === currentDate.getFullYear();
  }).length;

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  return (
    <Card className="w-full max-w-md mx-auto border-border/50 bg-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateMonth('prev')}
            className="h-7 w-7 text-muted-foreground hover:text-primary border border-border/30"
          >
            <ChevronLeft className="h-3 w-3" />
          </Button>
          <CardTitle className="text-base font-mono tracking-wider text-foreground/90">
            {monthNames[currentMonth]} {currentYear}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateMonth('next')}
            className="h-7 w-7 text-muted-foreground hover:text-primary border border-border/30"
          >
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
        <div className="text-center mt-2">
          <div className="text-xs text-muted-foreground font-mono">
            {submissionCount.toString().padStart(2, '0')} / {getDaysInMonth(currentDate).toString().padStart(2, '0')} active
          </div>
          <div className="w-16 h-px bg-primary/20 mx-auto mt-1" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Day labels */}
          <div className="grid grid-cols-7 gap-1">
            {dayNames.map((day, index) => (
              <div key={`day-${index}`} className="h-6 flex items-center justify-center text-xs font-mono text-muted-foreground/60">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {renderCalendarDays()}
          </div>
        </div>
        
        {/* Status indicators */}
        <div className="flex justify-between items-center mt-6 text-xs font-mono text-muted-foreground/60">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border border-border/30" />
            <span>Inactive</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border border-primary/60 bg-primary/20" />
            <span>Active</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}