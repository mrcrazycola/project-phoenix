
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Song table
CREATE TABLE public.song (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  song_tamil TEXT,
  song_english TEXT,
  url TEXT
);

CREATE INDEX idx_song_name_trgm ON public.song USING gin (name gin_trgm_ops);

-- Words (Bible verses) table
CREATE TABLE public.words (
  id BIGSERIAL PRIMARY KEY,
  "bookNum" INTEGER NOT NULL,
  "bookName" TEXT NOT NULL,
  "chNum" INTEGER NOT NULL,
  "verseNum" INTEGER NOT NULL,
  word TEXT,
  page_no TEXT
);

CREATE INDEX idx_words_book_ch_verse ON public.words ("bookNum", "chNum", "verseNum");
CREATE INDEX idx_words_booknum ON public.words ("bookNum");

-- Schedule song table
CREATE TABLE public.schedule_song (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

-- Song history table
CREATE TABLE public.song_history (
  id BIGSERIAL PRIMARY KEY,
  songname TEXT NOT NULL,
  "timestamp" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Verse history table
CREATE TABLE public.verse_history (
  id BIGSERIAL PRIMARY KEY,
  bookname TEXT,
  booknum INTEGER,
  chapnum INTEGER,
  versenum INTEGER,
  "timestamp" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Verse schedule table
CREATE TABLE public.schedule (
  id BIGSERIAL PRIMARY KEY,
  booknum INTEGER,
  bookname TEXT,
  chapternumber INTEGER,
  versenumber INTEGER
);

-- Sthothira Baligal table
CREATE TABLE public.sthothira_baligal (
  id INTEGER PRIMARY KEY,
  sthothira_baligal_list TEXT
);

-- Enable RLS on all tables (permissive for public access)
ALTER TABLE public.song ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.words ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_song ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.song_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verse_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sthothira_baligal ENABLE ROW LEVEL SECURITY;

-- Public access policies
CREATE POLICY "Public read song" ON public.song FOR SELECT USING (true);
CREATE POLICY "Public insert song" ON public.song FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update song" ON public.song FOR UPDATE USING (true);
CREATE POLICY "Public delete song" ON public.song FOR DELETE USING (true);

CREATE POLICY "Public read words" ON public.words FOR SELECT USING (true);

CREATE POLICY "Public all schedule_song" ON public.schedule_song FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public all song_history" ON public.song_history FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public all verse_history" ON public.verse_history FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public all schedule" ON public.schedule FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read sthothira" ON public.sthothira_baligal FOR SELECT USING (true);
