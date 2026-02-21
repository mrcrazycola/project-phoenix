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
    let bookNum = body.bookNum ? parseInt(body.bookNum) : 0;
    let chNum = body.chNum ? parseInt(body.chNum) : 0;
    let verseNum = body.verseNum ? parseInt(body.verseNum) : 0;

    async function getLastVerse(bk: number, ch: number) {
      const { data } = await supabase
        .from("words")
        .select("verseNum")
        .eq("bookNum", bk).eq("chNum", ch)
        .order("verseNum", { ascending: false })
        .limit(1);
      return data?.[0]?.verseNum || 1;
    }

    async function getLastChapter(bk: number) {
      const { data } = await supabase
        .from("words")
        .select("chNum")
        .eq("bookNum", bk)
        .order("chNum", { ascending: false })
        .limit(1);
      return data?.[0]?.chNum || 1;
    }

    async function getVerse(bk: number, ch: number, vs: number) {
      const { data } = await supabase
        .from("words")
        .select("word, page_no, bookName")
        .eq("bookNum", bk).eq("chNum", ch).eq("verseNum", vs)
        .limit(1);
      return data?.[0] || null;
    }

    async function findVerse(bk: number, ch: number, vs: number, previous: boolean) {
      const maxBooks = 66;
      let attempts = 0;
      while (attempts < 200) {
        const row = await getVerse(bk, ch, vs);
        if (row) return { bookNum: bk, chNum: ch, verseNum: vs, ...row };
        if (previous) {
          vs--;
          if (vs < 1) { ch--; if (ch < 1) { bk--; if (bk < 1) bk = maxBooks; ch = await getLastChapter(bk); } vs = await getLastVerse(bk, ch); }
        } else {
          vs++;
          const lastV = await getLastVerse(bk, ch);
          if (vs > lastV) { ch++; vs = 1; const lastC = await getLastChapter(bk); if (ch > lastC) { ch = 1; bk++; if (bk > maxBooks) bk = 1; } }
        }
        attempts++;
      }
      return null;
    }

    switch (action) {
      case "display": {
        const result = await findVerse(bookNum, chNum, verseNum, false);
        if (!result) return json({ error: "Verse not found" }, 404);
        // Log to history
        await supabase.from("verse_history").insert({
          bookname: result.bookName, booknum: result.bookNum,
          chapnum: result.chNum, versenum: result.verseNum,
        });
        return json({ book: result.bookName, bookNum: result.bookNum, chNum: result.chNum, verseNum: result.verseNum, verse: result.word });
      }

      case "next": {
        verseNum++;
        const result = await findVerse(bookNum, chNum, verseNum, false);
        if (!result) return json({ error: "Verse not found" }, 404);
        return json({ book: result.bookName, bookNum: result.bookNum, chNum: result.chNum, verseNum: result.verseNum, verse: result.word });
      }

      case "previous": {
        verseNum--;
        const result = await findVerse(bookNum, chNum, verseNum, true);
        if (!result) return json({ error: "Verse not found" }, 404);
        return json({ book: result.bookName, bookNum: result.bookNum, chNum: result.chNum, verseNum: result.verseNum, verse: result.word });
      }

      case "higlitbut": {
        const higlit = body.higlit || "";
        const row = await getVerse(bookNum, chNum, verseNum);
        if (!row) return json({ error: "Verse not found" }, 404);
        const highlighted = (row.word || "").replace(
          new RegExp(higlit.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
          `<span class="highlight">${higlit}</span>`
        );
        return json({ book: row.bookName, bookNum, chNum, verseNum, verse: highlighted });
      }

      case "searchChapter": {
        const { data: verses } = await supabase
          .from("words")
          .select("verseNum, word, bookName, bookNum")
          .eq("bookNum", bookNum).eq("chNum", chNum)
          .order("verseNum");

        const bookName = verses?.[0]?.bookName || "Unknown";

        // Get next/prev chapter info
        const { data: nextData } = await supabase.from("words").select("chNum").eq("bookNum", bookNum).gt("chNum", chNum).order("chNum").limit(1);
        const { data: prevData } = await supabase.from("words").select("chNum").eq("bookNum", bookNum).lt("chNum", chNum).order("chNum", { ascending: false }).limit(1);

        let nextBook = bookNum, nextCh = nextData?.[0]?.chNum;
        let prevBook = bookNum, prevCh = prevData?.[0]?.chNum;

        if (!nextCh) {
          const { data: nb } = await supabase.from("words").select("bookNum").gt("bookNum", bookNum).order("bookNum").limit(1);
          if (nb?.[0]) {
            nextBook = nb[0].bookNum;
            const { data: nc } = await supabase.from("words").select("chNum").eq("bookNum", nextBook).order("chNum").limit(1);
            nextCh = nc?.[0]?.chNum || 1;
          } else { nextBook = 1; nextCh = 1; }
        }
        if (!prevCh) {
          const { data: pb } = await supabase.from("words").select("bookNum").lt("bookNum", bookNum).order("bookNum", { ascending: false }).limit(1);
          if (pb?.[0]) {
            prevBook = pb[0].bookNum;
            const { data: pc } = await supabase.from("words").select("chNum").eq("bookNum", prevBook).order("chNum", { ascending: false }).limit(1);
            prevCh = pc?.[0]?.chNum || 1;
          } else { prevBook = 66; prevCh = await getLastChapter(66); }
        }

        return json({
          bookName,
          verses: (verses || []).map((v: any) => ({ verseNum: v.verseNum, word: v.word })),
          prevBook, prevChap: prevCh, nextBook, nextChap: nextCh,
        });
      }

      case "searchword": {
        const searchWord = body.searchWord || "";
        const { data } = await supabase
          .from("words")
          .select("bookName, bookNum, chNum, verseNum, word")
          .ilike("word", `%${searchWord}%`)
          .limit(100);
        return json({ results: data || [] });
      }

      case "previewVerse": {
        const row = await getVerse(bookNum, chNum, verseNum);
        return json({ preview: row?.word || null });
      }

      case "clear": {
        return text("Cleared");
      }

      case "scheduleverse": {
        const row = await getVerse(bookNum, chNum, verseNum);
        if (row) {
          await supabase.from("schedule").insert({
            booknum: bookNum, bookname: row.bookName,
            chapternumber: chNum, versenumber: verseNum,
          });
        }
        return json({ book: row?.bookName || "", bookNum, chNum, verseNum, verse: row?.word || "" });
      }

      default:
        return json({ error: "Unknown action: " + action }, 400);
    }
  } catch (e) {
    return json({ error: e.message }, 500);
  }
});
