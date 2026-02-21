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

function text(data: string, status = 200) {
  return new Response(data, { status, headers: { ...corsHeaders, "Content-Type": "text/plain" } });
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

    switch (action) {
      case "schedule_song": {
        const { song_name } = body;
        const { error } = await supabase.from("schedule_song").insert({ name: song_name });
        if (error) {
          if (error.code === "23505") return text("This song is already scheduled!");
          return text("Database error: " + error.message);
        }
        return text("Song successfully scheduled!");
      }

      case "fetch_scheduled_song": {
        const { song_name } = body;
        const { data, error } = await supabase
          .from("song")
          .select("song_tamil")
          .eq("name", song_name)
          .single();
        if (error || !data) return json(["Song not found."]);
        const song = (data.song_tamil || "").replace(/\\n/g, "\n");
        const lines = song.split(/\r?\n\s*\r?\n/);
        return json(lines);
      }

      case "fetch_options": {
        const { data } = await supabase.from("schedule_song").select("name");
        return json(data || []);
      }

      case "clear-schedule": {
        const { error } = await supabase.from("schedule_song").delete().neq("id", 0);
        if (error) return text("Error clearing schedule: " + error.message);
        return text("Schedule cleared!");
      }

      case "clear_scheduled_song": {
        const { song_name } = body;
        const { error, count } = await supabase
          .from("schedule_song")
          .delete()
          .eq("name", song_name);
        return json({ success: !error });
      }

      default:
        return json({ error: "Unknown action: " + action }, 400);
    }
  } catch (e) {
    return json({ error: e.message }, 500);
  }
});
