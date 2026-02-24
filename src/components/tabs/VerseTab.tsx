import { useState } from "react";
import { Monitor, ChevronLeft, ChevronRight, Eraser, Calendar, BookOpen, Highlighter, Search } from "lucide-react";
import { TAMIL_BOOKS, BOOK_CHAPTER_LIMITS } from "@/lib/bible-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VerseTabProps {
  onPresent: (title: string, content: string) => void;
}

const VerseTab = ({ onPresent }: VerseTabProps) => {
  const [bookNum, setBookNum] = useState<number | "">("");
  const [chNum, setChNum] = useState<number | "">("");
  const [verseNum, setVerseNum] = useState<number | "">("");
  const [highlightText, setHighlightText] = useState("");
  const [searchWord, setSearchWord] = useState("");
  const [verseDisplay, setVerseDisplay] = useState<{ book: string; ch: number; verse: number; text: string } | null>(null);
  const [preview, setPreview] = useState("");

  const chapterLimit = bookNum ? BOOK_CHAPTER_LIMITS[bookNum as number] : null;

  const handleDisplay = () => {
    if (!bookNum || !chNum || !verseNum) return;
    // Demo display
    const bookName = TAMIL_BOOKS[bookNum as number] || "Book";
    setVerseDisplay({
      book: bookName,
      ch: chNum as number,
      verse: verseNum as number,
      text: "இது ஒரு மாதிரி வசனம் - This is a sample verse text for demonstration purposes.",
    });
    onPresent(`${bookName} ${chNum}:${verseNum}`, "Sample verse text");
  };

  return (
    <div className="space-y-4">
      {/* Verse Display */}
      {verseDisplay && (
        <div className="glass-card rounded-xl p-4 border-l-4 border-primary">
          <h4 className="text-sm font-bold text-primary font-tamil">
            {verseDisplay.book} {verseDisplay.ch} : {verseDisplay.verse}
          </h4>
          <p className="text-sm mt-2 font-tamil leading-relaxed text-foreground/90">
            {verseDisplay.text}
          </p>
        </div>
      )}

      {/* Verse Selector */}
      <div className="glass-card rounded-xl p-4 space-y-3">
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
            Book
          </label>
          <Select
            value={bookNum ? String(bookNum) : undefined}
            onValueChange={(val) => {
              setBookNum(val ? Number(val) : "");
              setChNum("");
              setVerseNum("");
            }}
          >
            <SelectTrigger className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-sm font-tamil focus:ring-2 focus:ring-primary/40 transition-all h-auto">
              <SelectValue placeholder="📖 -- Select Book --" />
            </SelectTrigger>
            <SelectContent className="max-h-72 bg-popover border border-border shadow-xl rounded-lg">
              {Object.entries(TAMIL_BOOKS).map(([num, name]) => (
                <SelectItem
                  key={num}
                  value={num}
                  className="font-tamil text-sm cursor-pointer hover:bg-primary/10 focus:bg-primary/10 rounded-md transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-5 text-right">{num}.</span>
                    {name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
              Chapter {chapterLimit ? `(1-${chapterLimit.max})` : ""}
            </label>
            <input
              type="number"
              value={chNum}
              onChange={(e) => setChNum(e.target.value ? Number(e.target.value) : "")}
              min={1}
              max={chapterLimit?.max}
              className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
              Verse
            </label>
            <input
              type="number"
              value={verseNum}
              onChange={(e) => setVerseNum(e.target.value ? Number(e.target.value) : "")}
              min={1}
              className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            />
          </div>
        </div>

        {/* Preview area */}
        <div className="rounded-lg bg-background/50 border border-border px-4 py-3 min-h-[40px]">
          <p className="text-sm font-tamil text-muted-foreground">
            {preview || "Verse preview will appear here..."}
          </p>
        </div>

        {/* Action Buttons */}
        <button onClick={handleDisplay} className="w-full px-4 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
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

        <div className="grid grid-cols-3 gap-2">
          <button className="px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors flex items-center justify-center gap-1">
            <Eraser className="w-3.5 h-3.5" /> Clear
          </button>
          <button className="px-3 py-2 rounded-lg bg-accent text-accent-foreground text-sm hover:bg-accent/80 transition-colors flex items-center justify-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Schedule
          </button>
          <button className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-1">
            <BookOpen className="w-3.5 h-3.5" /> Chapter
          </button>
        </div>

        {/* Highlight */}
        <div className="flex gap-2">
          <input
            type="text"
            value={highlightText}
            onChange={(e) => setHighlightText(e.target.value)}
            placeholder="Highlight text..."
            className="flex-1 px-4 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
          />
          <button className="px-4 py-2.5 rounded-lg bg-warning text-warning-foreground text-sm font-medium hover:bg-warning/80 transition-colors flex items-center gap-1.5">
            <Highlighter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Word Search */}
      <div className="glass-card rounded-xl p-4 space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground">Search Word in Bible</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            placeholder="Enter a word..."
            className="flex-1 px-4 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
          />
          <button className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-1.5">
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* History */}
      <div className="glass-card rounded-xl p-4">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">History</h3>
        <div className="max-h-48 overflow-y-auto space-y-1.5">
          <p className="text-sm text-muted-foreground text-center py-3">Connect to backend to see verse history</p>
        </div>
      </div>
    </div>
  );
};

export default VerseTab;
