import { useState, useEffect, useRef } from "react";
import { X, Sparkles } from "lucide-react";

interface PresentingBarProps {
  presenting: { title: string; content: string } | null;
  onClear: () => void;
}

const PresentingBar = ({ presenting, onClear }: PresentingBarProps) => {
  const [flash, setFlash] = useState(false);
  const prevContentRef = useRef<string | null>(null);

  useEffect(() => {
    const newContent = presenting ? `${presenting.title}|${presenting.content}` : null;
    if (newContent && newContent !== prevContentRef.current) {
      setFlash(true);
      const timer = setTimeout(() => setFlash(false), 700);
      prevContentRef.current = newContent;
      return () => clearTimeout(timer);
    }
    if (!newContent) prevContentRef.current = null;
  }, [presenting]);

  const triggerFlash = () => {
    setFlash(false);
    requestAnimationFrame(() => setFlash(true));
    setTimeout(() => setFlash(false), 700);
  };

  return (
    <div
      className={`sticky top-0 z-50 bg-presenting text-presenting-foreground shadow-lg transition-all duration-300 ${
        flash ? "ring-2 ring-accent ring-offset-1 ring-offset-presenting" : ""
      }`}
    >
      {/* Flash overlay */}
      <div
        className={`absolute inset-0 bg-accent/20 pointer-events-none transition-opacity duration-500 ${
          flash ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="relative max-w-2xl mx-auto px-4 py-3">
        {presenting ? (
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-presenting-foreground/60 mb-1">
                Now Presenting
              </p>
              <p className={`text-sm font-bold truncate transition-transform duration-300 ${flash ? "scale-105" : "scale-100"}`}>
                {presenting.title}
              </p>
              <p className={`text-sm mt-1 font-tamil leading-relaxed line-clamp-2 text-presenting-foreground/90 transition-transform duration-300 ${flash ? "translate-y-0.5" : "translate-y-0"}`}>
                {presenting.content}
              </p>
            </div>
            <div className="flex flex-col gap-1.5 shrink-0">
              <button
                onClick={triggerFlash}
                className="p-1.5 rounded-full hover:bg-accent/20 transition-colors"
                title="Replay animation"
              >
                <Sparkles className={`w-4 h-4 transition-transform duration-300 ${flash ? "rotate-180 text-accent" : ""}`} />
              </button>
              <button
                onClick={onClear}
                className="p-1.5 rounded-full hover:bg-presenting-foreground/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-1">
            <p className="text-sm text-presenting-foreground/50 italic">
              Nothing presenting — select a song or verse
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PresentingBar;
