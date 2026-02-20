import { X } from "lucide-react";

interface PresentingBarProps {
  presenting: { title: string; content: string } | null;
  onClear: () => void;
}

const PresentingBar = ({ presenting, onClear }: PresentingBarProps) => {
  return (
    <div className="sticky top-0 z-50 bg-presenting text-presenting-foreground shadow-lg">
      <div className="max-w-2xl mx-auto px-4 py-3">
        {presenting ? (
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-presenting-foreground/60 mb-1">
                Now Presenting
              </p>
              <p className="text-sm font-bold truncate">{presenting.title}</p>
              <p className="text-sm mt-1 font-tamil leading-relaxed line-clamp-2 text-presenting-foreground/90">
                {presenting.content}
              </p>
            </div>
            <button
              onClick={onClear}
              className="p-1.5 rounded-full hover:bg-presenting-foreground/10 transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
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
