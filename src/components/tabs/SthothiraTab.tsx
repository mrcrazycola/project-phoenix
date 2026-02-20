import { useState } from "react";
import { Monitor, ChevronLeft, ChevronRight } from "lucide-react";

interface SthothiraTabProps {
  onPresent: (title: string, content: string) => void;
}

const SthothiraTab = ({ onPresent }: SthothiraTabProps) => {
  const [value, setValue] = useState<number | "">("");

  return (
    <div className="glass-card rounded-xl p-4 space-y-4">
      <h3 className="text-sm font-semibold text-muted-foreground">Sthothira Baligal</h3>

      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
          Enter the number
        </label>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value ? Number(e.target.value) : "")}
          min={1}
          className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
        />
      </div>

      <button
        onClick={() => {
          if (value) onPresent("Sothothira Bali", `#${value}`);
        }}
        className="w-full px-4 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
      >
        <Monitor className="w-4 h-4" />
        Display
      </button>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setValue((prev) => (typeof prev === "number" && prev > 1 ? prev - 1 : 1))}
          className="px-4 py-2.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center justify-center gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        <button
          onClick={() => setValue((prev) => (typeof prev === "number" ? prev + 1 : 1))}
          className="px-4 py-2.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center justify-center gap-1.5"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SthothiraTab;
