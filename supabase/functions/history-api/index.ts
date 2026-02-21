import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const body = await req.json();
    const action = body.action;
    const today = new Date().toISOString().split("T")[0];

    switch (action) {
      case "fetchHistory": {
        const { data } = await supabase
          .from("verse_history")
          .select("bookname, booknum, chapnum, versenum, timestamp")
          .gte("timestamp", today + "T00:00:00")
          .lte("timestamp", today + "T23:59:59")
          .order("timestamp", { ascending: false });

        if (!data || data.length === 0) {
          return json({ message: "No history found for today" });
        }
        return json(
          data.map((r: any) => ({
            bookName: r.bookname,
            bookNum: r.booknum,
            chNum: r.chapnum,
            verseNum: r.versenum,
            timestamp: r.timestamp,
          }))
        );
      }

      case "fetchSongHistory": {
        const { data } = await supabase
          .from("song_history")
          .select("songname, timestamp")
          .gte("timestamp", today + "T00:00:00")
          .lte("timestamp", today + "T23:59:59")
          .order("timestamp", { ascending: false });

        if (!data || data.length === 0) {
          return json({ message: "No history found for today" });
        }
        return json(
          data.map((r: any) => ({
            songName: r.songname,
            timestamp: r.timestamp,
          }))
        );
      }

      default:
        return json({ error: "Unknown action: " + action }, 400);
    }
  } catch (e) {
    return json({ error: e.message }, 500);
  }
});
