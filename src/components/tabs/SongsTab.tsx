import { useState, useCallback } from "react";
import { Search, Trash2, Plus, Edit, Calendar, ExternalLink, Eraser, Music } from "lucide-react";
import SongDisplay from "@/components/SongDisplay";

interface SongsTabProps {
  onPresent: (title: string, content: string) => void;
}

// Demo songs for the UI preview (replace with API calls when connected to backend)
const DEMO_SONGS = [
  "அல்லேலூயா ஜெயம் - Hallelujah Jayam",
  "இயேசுவே நீர் போதும் - Yesuve Neer Pothum",
  "கர்த்தரே உம் சமூகம் - Karthare Um Samugam",
  "நன்றி சொல்வேன் - Nandri Solven",
  "ராஜாதி ராஜா - Rajathi Raja",
];

const SongsTab = ({ onPresent }: SongsTabProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [inBetween, setInBetween] = useState(false);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [selectedSong, setSelectedSong] = useState<string | null>(null);
  const [songStanzas, setSongStanzas] = useState<string[]>([]);
  const [textAreaValue, setTextAreaValue] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(() => {
    if (!searchTerm.trim()) return;
    // Demo: filter from demo songs
    const filtered = DEMO_SONGS.filter((s) =>
      s.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(filtered.length > 0 ? filtered : []);
    setHasSearched(true);
  }, [searchTerm]);

  const handleSelectSong = (songName: string) => {
    setSelectedSong(songName);
    // Demo stanzas
    setSongStanzas([
      "முதல் சரணம் - First stanza of the song\nLorem ipsum dolor sit amet",
      "இரண்டாம் சரணம் - Second stanza\nConsectetur adipiscing elit",
      "மூன்றாம் சரணம் - Third stanza\nSed do eiusmod tempor incididunt",
    ]);
  };

  const handleDisplayText = () => {
    if (!textAreaValue.trim()) return;
    const stanzas = textAreaValue.split(/\n\s*\n/);
    setSongStanzas(stanzas);
    setSelectedSong("Custom Text");
  };

  const handleStanzaClick = (stanza: string) => {
    onPresent(selectedSong || "Song", stanza);
  };

  return (
    <div className="space-y-4">
      {/* Search Area */}
      <div className="glass-card rounded-xl p-4 space-y-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="space-y-3"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter song name..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="inBetween"
              checked={inBetween}
              onChange={(e) => setInBetween(e.target.checked)}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
            />
            <label htmlFor="inBetween" className="text-sm text-muted-foreground">
              Search in lyrics
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5" />
              Search
            </button>
            <button type="button" onClick={() => onPresent("", "")} className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center gap-1.5">
              <Eraser className="w-3.5 h-3.5" />
              Clear
            </button>
            <button type="button" className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5" />
              Google
            </button>
            <button type="button" className="px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/80 transition-colors flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Schedule
            </button>
          </div>
        </form>
      </div>

      {/* Search Results */}
      {hasSearched && (
        <div className="glass-card rounded-xl p-4 max-h-[400px] overflow-auto">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">
            Search Results ({searchResults.length})
          </h3>
          {searchResults.length > 0 ? (
            <ul className="space-y-2">
              {searchResults.map((song, i) => (
                <li key={i} className="flex items-center justify-between group">
                  <button
                    onClick={() => handleSelectSong(song)}
                    className="flex-1 text-left px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/10 text-foreground transition-colors flex items-center gap-2"
                  >
                    <Music className="w-4 h-4 text-primary shrink-0" />
                    <span className="font-tamil">{song}</span>
                  </button>
                  <button className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-secondary transition-all">
                    <Edit className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No results found.</p>
          )}
        </div>
      )}

      {/* Song Display */}
      {songStanzas.length > 0 && (
        <SongDisplay
          songName={selectedSong || ""}
          stanzas={songStanzas}
          onStanzaClick={handleStanzaClick}
        />
      )}

      {/* Text Area */}
      <div className="glass-card rounded-xl p-4 space-y-3">
        <textarea
          value={textAreaValue}
          onChange={(e) => setTextAreaValue(e.target.value)}
          placeholder="Enter the full song here (separate stanzas with blank lines)..."
          rows={4}
          className="w-full px-4 py-3 rounded-lg bg-background border border-border text-sm font-tamil resize-y focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
        />
        <div className="flex flex-wrap gap-2">
          <button onClick={handleDisplayText} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            Display
          </button>
          <button onClick={() => setTextAreaValue("")} className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center gap-1.5">
            <Eraser className="w-3.5 h-3.5" />
            Clear
          </button>
          <button className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-colors flex items-center gap-1.5">
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
          <button className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center gap-1.5">
            <Edit className="w-3.5 h-3.5" />
            Edit
          </button>
          <button className="px-4 py-2 rounded-lg bg-success text-success-foreground text-sm font-medium hover:bg-success/90 transition-colors flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            Add New
          </button>
        </div>
      </div>

      {/* Song History */}
      <div className="glass-card rounded-xl p-4">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">History</h3>
        <div className="max-h-48 overflow-y-auto space-y-1.5">
          {DEMO_SONGS.slice(0, 3).map((song, i) => (
            <button
              key={i}
              onClick={() => handleSelectSong(song)}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-tamil bg-primary/5 hover:bg-primary/10 transition-colors"
            >
              {song}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SongsTab;
