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
    let value = parseInt(body.value) || 1;

    if (action === "previous-sthothira-button") value--;
    else if (action === "next-sthothira-button") value++;

    if (value >= 1001) value = 1;
    if (value <= 0) value = 1;

    const { data, error } = await supabase
      .from("sthothira_baligal")
      .select("sthothira_baligal_list")
      .eq("id", value)
      .single();

    const sentence = data?.sthothira_baligal_list || "Value out of range";
    return json({ newValue: value, sentence });
  } catch (e) {
    return json({ error: e.message }, 500);
  }
});
