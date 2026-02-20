import { useState } from "react";

interface SongDisplayProps {
  songName: string;
  stanzas: string[];
  onStanzaClick: (stanza: string) => void;
}

const SongDisplay = ({ songName, stanzas, onStanzaClick }: SongDisplayProps) => {
  const [activeStanza, setActiveStanza] = useState<number | null>(null);

  const handleClick = (index: number, stanza: string) => {
    setActiveStanza(index);
    onStanzaClick(stanza);
  };

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>, index: number, stanza: string) => {
    e.stopPropagation();
    if (e.target.checked) {
      setActiveStanza(index);
      // This would send the stanza toggle via API
    } else {
      setActiveStanza(null);
    }
  };

  return (
    <div className="glass-card rounded-xl p-4">
      {songName && (
        <h3 className="text-sm font-semibold text-primary mb-3 font-tamil">{songName}</h3>
      )}
      <ul className="space-y-2">
        {stanzas.map((stanza, i) => (
          <li
            key={i}
            onClick={() => handleClick(i, stanza)}
            className={`relative px-4 py-3 pr-14 rounded-lg text-sm font-tamil leading-relaxed cursor-pointer transition-all duration-200 ${
              activeStanza === i
                ? "bg-accent/20 border border-accent/40 shadow-sm"
                : "bg-background hover:bg-primary/5 border border-transparent"
            }`}
          >
            <div className="whitespace-pre-wrap">{stanza}</div>
            
            {/* Toggle switch */}
            <label
              className="absolute top-3 right-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <input
                  type="checkbox"
                  checked={activeStanza === i}
                  onChange={(e) => handleToggle(e, i, stanza)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-border rounded-full peer-checked:bg-primary transition-colors" />
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-card rounded-full shadow-sm transition-transform peer-checked:translate-x-4" />
              </div>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SongDisplay;
