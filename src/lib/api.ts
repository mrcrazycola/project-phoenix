import { supabase } from "@/integrations/supabase/client";

const PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID;

async function invokeFunction(functionName: string, body: Record<string, unknown>): Promise<Response> {
  const url = `https://${PROJECT_ID}.supabase.co/functions/v1/${functionName}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
    body: JSON.stringify(body),
  });
  return response;
}

async function invokeJson(functionName: string, body: Record<string, unknown>): Promise<any> {
  const res = await invokeFunction(functionName, body);
  return res.json();
}

async function invokeText(functionName: string, body: Record<string, unknown>): Promise<string> {
  const res = await invokeFunction(functionName, body);
  return res.text();
}

// Song APIs
export const songApi = {
  search: (searchTerm: string, inBetween: boolean) =>
    invokeJson("song-api", { action: inBetween ? "search_song_word" : "search", search_term: searchTerm }),

  getSong: (songName: string) =>
    invokeJson("song-api", { action: "get_song", song_name: songName }),

  saveSong: (songName: string, editedSong: string) =>
    invokeText("song-api", { action: "save_edited_song", song_name: songName, edited_song: editedSong }),

  addSong: (name: string, content: string, english: string, url: string) =>
    invokeText("song-api", {
      action: "save_new_song",
      new_song_name: name,
      new_song_content: content,
      new_song_english: english,
      new_song_URL: url,
    }),

  deleteSong: (songName: string) =>
    invokeText("song-api", { action: "delete_song", song_name: songName }),

  renameSong: (oldName: string, newName: string) =>
    invokeText("song-api", { action: "rename_song", old_name: oldName, name: newName }),

  clickLine: (name: string, line: string) =>
    invokeText("song-api", { action: "click_line", name, clicked_line: line }),

  clickSong: (name: string, song: string) =>
    invokeText("song-api", { action: "click_song", name, clicked_song: song }),

  stanza: (songName: string, line: string) =>
    invokeText("song-api", { action: "stanza", song_name: songName, clicked_line: line }),
};

// Schedule APIs
export const scheduleApi = {
  scheduleSong: (songName: string) =>
    invokeText("schedule-api", { action: "schedule_song", song_name: songName }),

  fetchScheduledSong: (songName: string) =>
    invokeJson("schedule-api", { action: "fetch_scheduled_song", song_name: songName }),

  fetchOptions: () =>
    invokeJson("schedule-api", { action: "fetch_options" }),

  clearSchedule: () =>
    invokeText("schedule-api", { action: "clear-schedule" }),

  clearScheduledSong: (songName: string) =>
    invokeJson("schedule-api", { action: "clear_scheduled_song", song_name: songName }),
};

// Verse APIs
export const verseApi = {
  display: (bookNum: number, chNum: number, verseNum: number) =>
    invokeJson("verse-api", { action: "display", bookNum, chNum, verseNum }),

  next: (bookNum: number, chNum: number, verseNum: number) =>
    invokeJson("verse-api", { action: "next", bookNum, chNum, verseNum }),

  previous: (bookNum: number, chNum: number, verseNum: number) =>
    invokeJson("verse-api", { action: "previous", bookNum, chNum, verseNum }),

  highlight: (bookNum: number, chNum: number, verseNum: number, higlit: string) =>
    invokeJson("verse-api", { action: "higlitbut", bookNum, chNum, verseNum, higlit }),

  searchChapter: (bookNum: number, chNum: number) =>
    invokeJson("verse-api", { action: "searchChapter", bookNum, chNum }),

  searchWord: (searchWord: string) =>
    invokeJson("verse-api", { action: "searchword", searchWord }),

  preview: (bookNum: number, chNum: number, verseNum: number) =>
    invokeJson("verse-api", { action: "previewVerse", bookNum, chNum, verseNum }),

  clear: () =>
    invokeText("verse-api", { action: "clear" }),

  scheduleVerse: (bookNum: number, chNum: number, verseNum: number) =>
    invokeJson("verse-api", { action: "scheduleverse", bookNum, chNum, verseNum }),
};

// History APIs
export const historyApi = {
  fetchVerseHistory: () =>
    invokeJson("history-api", { action: "fetchHistory" }),

  fetchSongHistory: () =>
    invokeJson("history-api", { action: "fetchSongHistory" }),
};

// Sthothira Baligal API
export const sthothiraApi = {
  display: (value: number) =>
    invokeJson("sthothira-api", { action: "display-sthothira-button", value }),

  previous: (value: number) =>
    invokeJson("sthothira-api", { action: "previous-sthothira-button", value }),

  next: (value: number) =>
    invokeJson("sthothira-api", { action: "next-sthothira-button", value }),
};
