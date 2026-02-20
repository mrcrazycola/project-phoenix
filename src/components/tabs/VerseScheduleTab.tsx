import { Monitor, ChevronLeft, ChevronRight, Eraser, Calendar } from "lucide-react";

interface VerseScheduleTabProps {
  onPresent: (title: string, content: string) => void;
}

const VerseScheduleTab = ({ onPresent }: VerseScheduleTabProps) => {
  return (
    <div className="glass-card rounded-xl p-4 space-y-4">
      <h3 className="text-sm font-semibold text-muted-foreground">Verse Schedule</h3>
      
      <select className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-sm font-tamil focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all">
        <option>-- No scheduled verses --</option>
      </select>

      <button className="w-full px-4 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
        <Monitor className="w-4 h-4" />
        Display Verse
      </button>

      <div className="grid grid-cols-2 gap-2">
        <button className="px-4 py-2.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center justify-center gap-1.5">
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        <button className="px-4 py-2.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center justify-center gap-1.5">
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button className="px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors flex items-center justify-center gap-1.5">
          <Eraser className="w-3.5 h-3.5" /> Clear
        </button>
        <button className="px-3 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm hover:bg-destructive/90 transition-colors flex items-center justify-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" /> Clear Schedule
        </button>
      </div>
    </div>
  );
};

export default VerseScheduleTab;
