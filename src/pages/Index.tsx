import { useState } from "react";
import { Music, Calendar, Image, BookOpen, ListOrdered, Star } from "lucide-react";
import PresentingBar from "@/components/PresentingBar";
import SongsTab from "@/components/tabs/SongsTab";
import ScheduleTab from "@/components/tabs/ScheduleTab";
import MediaTab from "@/components/tabs/MediaTab";
import VerseTab from "@/components/tabs/VerseTab";
import VerseScheduleTab from "@/components/tabs/VerseScheduleTab";
import SthothiraTab from "@/components/tabs/SthothiraTab";
import MessageBar from "@/components/MessageBar";

const tabs = [
  { id: "songs", label: "Songs", icon: Music },
  { id: "schedule", label: "Schedule", icon: Calendar },
  { id: "media", label: "Media", icon: Image },
  { id: "verse", label: "Verse", icon: BookOpen },
  { id: "verse-schedule", label: "V. Schedule", icon: ListOrdered },
  { id: "sthothira", label: "Sthothira", icon: Star },
] as const;

type TabId = (typeof tabs)[number]["id"];

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabId>("songs");
  const [presenting, setPresenting] = useState<{ title: string; content: string } | null>(null);

  const handlePresent = (title: string, content: string) => {
    setPresenting({ title, content });
  };

  return (
    <div className="min-h-screen bg-background pb-4">
      {/* Presenting Bar */}
      <PresentingBar presenting={presenting} onClear={() => setPresenting(null)} />

      {/* Tab Navigation */}
      <div className="sticky top-[72px] z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-2xl mx-auto px-2">
          <div className="flex gap-1 py-2 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                      : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Message Bar */}
      <div className="max-w-2xl mx-auto px-4 mt-3">
        <MessageBar />
      </div>

      {/* Tab Content */}
      <div className="max-w-2xl mx-auto px-4 mt-3 animate-fade-in">
        {activeTab === "songs" && <SongsTab onPresent={handlePresent} />}
        {activeTab === "schedule" && <ScheduleTab onPresent={handlePresent} />}
        {activeTab === "media" && <MediaTab />}
        {activeTab === "verse" && <VerseTab onPresent={handlePresent} />}
        {activeTab === "verse-schedule" && <VerseScheduleTab onPresent={handlePresent} />}
        {activeTab === "sthothira" && <SthothiraTab onPresent={handlePresent} />}
      </div>
    </div>
  );
};

export default Index;
