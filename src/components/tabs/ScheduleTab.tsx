import { useState } from "react";
import { Download, X } from "lucide-react";

interface ScheduleTabProps {
  onPresent: (title: string, content: string) => void;
}

const DEMO_SCHEDULE = ["அல்லேலூயா ஜெயம்", "கர்த்தரே உம் சமூகம்", "நன்றி சொல்வேன்"];

const ScheduleTab = ({ onPresent }: ScheduleTabProps) => {
  const [selected, setSelected] = useState(DEMO_SCHEDULE[0]);

  return (
    <div className="glass-card rounded-xl p-4 space-y-4">
      <h3 className="text-sm font-semibold text-muted-foreground">Song Schedule</h3>

      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-tamil"
      >
        {DEMO_SCHEDULE.map((song, i) => (
          <option key={i} value={song}>{song}</option>
        ))}
      </select>

      <div className="flex gap-2">
        <button
          onClick={() => onPresent(selected, "Fetching song...")}
          className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Fetch Song
        </button>
        <button className="flex-1 px-4 py-2.5 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-colors flex items-center justify-center gap-2">
          <X className="w-4 h-4" />
          Remove
        </button>
      </div>
    </div>
  );
};

export default ScheduleTab;
