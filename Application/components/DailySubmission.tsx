import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { toast } from "sonner@2.0.3";

interface DailySubmissionProps {
  onSubmission: (entry: { task: string; note: string; timestamp: string }) => void;
  hasSubmittedToday: boolean;
}

export function DailySubmission({ onSubmission, hasSubmittedToday }: DailySubmissionProps) {
  const [task, setTask] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!task.trim()) {
      toast.error("Input required for system update");
      return;
    }

    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const entry = {
      task: task.trim(),
      note: note.trim(),
      timestamp: new Date().toISOString()
    };
    
    onSubmission(entry);
    
    setTask("");
    setNote("");
    setIsSubmitting(false);
    
    toast.success("Data processed. System updated.");
  };

  if (hasSubmittedToday) {
    return (
      <Card className="w-full max-w-md mx-auto border-border/50 bg-card">
        <CardContent className="flex flex-col items-center text-center p-8">
          <div className="w-12 h-12 border border-primary/50 bg-primary/10 flex items-center justify-center mb-6">
            <div className="w-6 h-6 border border-primary bg-primary/20" />
          </div>
          <div className="text-sm tracking-wide text-foreground/90 mb-2">
            Current session complete
          </div>
          <div className="text-xs text-muted-foreground mb-6 max-w-xs">
            Daily input recorded. Return in next cycle to maintain system continuity.
          </div>
          <div className="text-xs text-primary/80 border border-primary/20 bg-primary/5 px-3 py-1">
            Status: Active
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto border-border/50 bg-card">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-lg tracking-wide text-foreground/90">Data Input</CardTitle>
        <div className="w-12 h-px bg-primary/30 mx-auto mt-2" />
        <div className="text-xs text-muted-foreground mt-4">
          Record daily progress to maintain system integrity
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="task" className="text-xs tracking-wide text-foreground/80 uppercase">
              Primary Task
            </Label>
            <Input
              id="task"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Exercise completed, knowledge acquired, skill practiced..."
              className="mt-2 bg-input-background border-border/50 text-sm"
              maxLength={100}
              required
            />
            <div className="text-xs text-muted-foreground/60 mt-1 text-right font-mono">
              {task.length}/100
            </div>
          </div>
          
          <div>
            <Label htmlFor="note" className="text-xs tracking-wide text-foreground/80 uppercase">
              Additional Data
            </Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Supplementary observations, metrics, reflections..."
              className="mt-2 bg-input-background border-border/50 text-sm min-h-[70px] resize-none"
              maxLength={300}
            />
            <div className="text-xs text-muted-foreground/60 mt-1 text-right font-mono">
              {note.length}/300
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full mt-8 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30" 
            disabled={isSubmitting}
            size="lg"
            variant="outline"
          >
            <span className="tracking-wide text-sm">
              {isSubmitting ? "Processing..." : "Submit Data"}
            </span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}