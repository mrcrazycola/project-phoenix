import { TAMIL_BOOKS } from "./bible-data";

// Configure this to point to your PHP backend server
const API_BASE = ""; // Same-origin, or set to your PHP server URL like "http://192.168.29.170/bible"

interface ApiOptions {
  action: string;
  [key: string]: string | number | boolean | undefined;
}

export async function apiPost(data: ApiOptions): Promise<any> {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      formData.append(key, String(value));
    }
  });

  const response = await fetch(API_BASE, {
    method: "POST",
    body: formData,
  });

  return response;
}

export async function apiPostJson(data: ApiOptions): Promise<any> {
  const response = await apiPost(data);
  return response.json();
}

export async function apiPostText(data: ApiOptions): Promise<string> {
  const response = await apiPost(data);
  return response.text();
}

// Song APIs
export const songApi = {
  search: (searchTerm: string, inBetween: boolean) =>
    apiPostText({ action: inBetween ? "search_song_word" : "search", search_term: searchTerm }),
  
  getSong: (songName: string) =>
    apiPostJson({ action: "get_song", song_name: songName }),
  
  saveSong: (songName: string, editedSong: string) =>
    apiPostText({ action: "save_edited_song", song_name: songName, edited_song: editedSong }),
  
  addSong: (name: string, content: string, english: string, url: string) =>
    apiPostText({
      action: "save_new_song",
      new_song_name: name,
      new_song_content: content,
      new_song_english: english,
      new_song_URL: url,
    }),
  
  deleteSong: (songName: string) =>
    apiPostText({ action: "delete_song", song_name: songName }),
  
  renameSong: (oldName: string, newName: string) =>
    apiPostText({ action: "", old_name: oldName, name: newName }),
  
  clickLine: (name: string, line: string) =>
    apiPostText({ action: "click_line", name, clicked_line: line }),
  
  clickSong: (name: string, song: string) =>
    apiPostText({ action: "click_song", name, clicked_song: song }),
  
  stanza: (songName: string, line: string) =>
    apiPostText({ action: "stanza", song_name: songName, clicked_line: line }),
};

// Schedule APIs
export const scheduleApi = {
  scheduleSong: (songName: string) =>
    apiPostText({ action: "schedule_song", song_name: songName }),
  
  fetchScheduledSong: (songName: string) =>
    apiPostJson({ action: "fetch_scheduled_song", song_name: songName }),
  
  fetchOptions: () =>
    apiPostJson({ action: "fetch_options" }),
  
  clearSchedule: () =>
    apiPostText({ action: "clear-schedule" }),
  
  clearScheduledSong: (songName: string) =>
    apiPostJson({ action: "clear_scheduled_song", song_name: songName }),
};

// Verse APIs
export const verseApi = {
  display: (bookNum: number, chNum: number, verseNum: number) =>
    apiPostJson({ action: "display", bookNum, chNum, verseNum }),
  
  next: (bookNum: number, chNum: number, verseNum: number) =>
    apiPostJson({ action: "next", bookNum, chNum, verseNum }),
  
  previous: (bookNum: number, chNum: number, verseNum: number) =>
    apiPostJson({ action: "previous", bookNum, chNum, verseNum }),
  
  highlight: (bookNum: number, chNum: number, verseNum: number, higlit: string) =>
    apiPostJson({ action: "higlitbut", bookNum, chNum, verseNum, higlit }),
  
  searchChapter: (bookNum: number, chNum: number) =>
    apiPostJson({ action: "searchChapter", bookNum, chNum }),
  
  searchWord: (searchWord: string) =>
    apiPostJson({ action: "searchword", searchWord }),
  
  preview: (bookNum: number, chNum: number, verseNum: number) =>
    apiPostJson({ action: "previewVerse", bookNum, chNum, verseNum }),
  
  clear: () =>
    apiPostText({ action: "clear" }),
  
  scheduleVerse: (bookNum: number, chNum: number, verseNum: number) =>
    apiPostJson({ action: "scheduleverse", bookNum, chNum, verseNum }),
};

// History APIs  
export const historyApi = {
  fetchVerseHistory: async () => {
    const formData = new FormData();
    formData.append("fetchHistory", "true");
    const res = await fetch(API_BASE, { method: "POST", body: formData });
    return res.json();
  },
  
  fetchSongHistory: async () => {
    const formData = new FormData();
    formData.append("fetchSongHistorycall", "true");
    const res = await fetch(API_BASE, { method: "POST", body: formData });
    return res.json();
  },
};

// Sthothira Baligal API
export const sthothiraApi = {
  display: (value: number) =>
    apiPostJson({ action: "display-sthothira-button", value }),
  
  previous: (value: number) =>
    apiPostJson({ action: "previous-sthothira-button", value }),
  
  next: (value: number) =>
    apiPostJson({ action: "next-sthothira-button", value }),
};
