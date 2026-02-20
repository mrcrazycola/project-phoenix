import { Upload, RefreshCw, ZoomIn, ZoomOut, RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

const MediaTab = () => {
  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div className="glass-card rounded-xl p-4">
        <label className="flex items-center justify-center gap-2 px-4 py-8 rounded-lg border-2 border-dashed border-border hover:border-primary/40 cursor-pointer transition-colors bg-background/50">
          <Upload className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-muted-foreground">Upload Images / Videos</span>
          <input type="file" accept="image/*,video/*" multiple className="hidden" />
        </label>
      </div>

      {/* File Browser */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-muted-foreground">Browse Files</h3>
          <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <RefreshCw className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <div className="h-40 flex items-center justify-center rounded-lg bg-background border border-border">
          <p className="text-sm text-muted-foreground">Connect to backend to browse files</p>
        </div>
      </div>

      {/* Image Controls */}
      <div className="glass-card rounded-xl p-4">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">Image Controls</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          <button className="px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors flex items-center gap-1.5">
            <ZoomIn className="w-4 h-4" /> Zoom In
          </button>
          <button className="px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors flex items-center gap-1.5">
            <ZoomOut className="w-4 h-4" /> Zoom Out
          </button>
          <button className="px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors flex items-center gap-1.5">
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>
        <div className="flex justify-center gap-6">
          {[
            { icon: ArrowLeft, label: "Left" },
            { icon: ArrowUp, label: "Up" },
            { icon: ArrowDown, label: "Down" },
            { icon: ArrowRight, label: "Right" },
          ].map(({ icon: Icon, label }) => (
            <button key={label} className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-secondary transition-colors">
              <Icon className="w-5 h-5 text-foreground" />
              <span className="text-xs text-muted-foreground">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MediaTab;
