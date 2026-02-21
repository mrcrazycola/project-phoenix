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
  return new Response(data, {
    status,
    headers: { ...corsHeaders, "Content-Type": "text/plain" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const body = await req.json();
    const action = body.action;

    switch (action) {
      case "search": {
        const searchTerm = body.search_term || "";
        const { data, error } = await supabase
          .from("song")
          .select("name")
          .ilike("name", `%${searchTerm}%`)
          .order("name");
        if (error) return json({ error: error.message }, 500);
        return json(data.map((r: any) => r.name));
      }

      case "search_song_word": {
        const searchTerm = body.search_term || "";
        const { data, error } = await supabase
          .from("song")
          .select("name, song_english")
          .ilike("song_english", `%${searchTerm}%`)
          .order("name");
        if (error) return json({ error: error.message }, 500);

        const results = (data || []).map((row: any) => {
          const lines = (row.song_english || "").split(/\r?\n/);
          let matchedLines = "";
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].toLowerCase().includes(searchTerm.toLowerCase())) {
              matchedLines = lines[i];
              if (lines[i + 1]) matchedLines += "\n" + lines[i + 1];
              break;
            }
          }
          return { name: row.name, matchedLines };
        });
        return json(results);
      }

      case "get_song": {
        const songName = body.song_name;
        const { data, error } = await supabase
          .from("song")
          .select("song_tamil")
          .eq("name", songName)
          .single();
        if (error || !data) return json(["Song not found."]);
        const song = (data.song_tamil || "").replace(/\\n/g, "\n");
        const lines = song.split(/\r?\n\s*\r?\n/);
        return json(lines);
      }

      case "save_edited_song": {
        const { song_name, edited_song } = body;
        const { error } = await supabase
          .from("song")
          .update({ song_tamil: edited_song })
          .eq("name", song_name);
        if (error) return text("Error updating the song: " + error.message);
        return text("Song updated successfully!");
      }

      case "save_new_song": {
        const { new_song_name, new_song_content, new_song_english, new_song_URL } = body;
        const { error } = await supabase.from("song").insert({
          name: new_song_name,
          song_tamil: new_song_content,
          song_english: new_song_english,
          url: new_song_URL,
        });
        if (error) return text("Error adding the new song: " + error.message);
        return text("New song added successfully!");
      }

      case "delete_song": {
        const { song_name } = body;
        const { error } = await supabase.from("song").delete().eq("name", song_name);
        if (error) return text("Error deleting song: " + error.message);
        return text("Song deleted successfully.");
      }

      case "rename_song": {
        const { old_name, name } = body;
        const { error } = await supabase
          .from("song")
          .update({ name })
          .eq("name", old_name);
        if (error) return text("error");
        return text("success");
      }

      case "click_song": {
        const { clicked_song, name } = body;
        if (name !== "Not from DB") {
          // Insert into song_history if not already logged today
          const today = new Date().toISOString().split("T")[0];
          const { data: existing } = await supabase
            .from("song_history")
            .select("id")
            .eq("songname", name)
            .gte("timestamp", today + "T00:00:00")
            .lte("timestamp", today + "T23:59:59")
            .limit(1);
          if (!existing || existing.length === 0) {
            await supabase.from("song_history").insert({ songname: name });
          }
        }
        return text("Success");
      }

      case "click_line": {
        // In PHP this sends to WebSocket - just acknowledge here
        return text("Presenting: " + (body.clicked_line || ""));
      }

      case "stanza": {
        return text("Presenting: " + (body.clicked_line || ""));
      }

      default:
        return json({ error: "Unknown action: " + action }, 400);
    }
  } catch (e) {
    return json({ error: e.message }, 500);
  }
});
