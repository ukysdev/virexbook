import { apiOk } from "@/lib/api"
import { extractAudiobookBookIds, markBooksAsAudiobooks } from "@/lib/audiobooks"
import { createClient } from "@/lib/supabase/server"
import type { Book } from "@/lib/types"

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const q = searchParams.get("q")?.trim().toLowerCase() || ""
  const limit = Math.min(Number(searchParams.get("limit") || "24"), 100)

  const { data: audioRows } = await supabase
    .from("chapters")
    .select("book_id")
    .eq("status", "published")
    .not("audio_url", "is", null)
    .limit(5000)

  const audiobookBookIds = extractAudiobookBookIds(audioRows)
  if (audiobookBookIds.length === 0) {
    return apiOk({ items: [], total: 0 })
  }

  const { data } = await supabase
    .from("books")
    .select("*, profiles(*)")
    .eq("status", "published")
    .in("id", audiobookBookIds)
    .order("created_at", { ascending: false })
    .limit(limit)

  const items = markBooksAsAudiobooks((data || []) as Book[], audiobookBookIds).filter(
    (book) =>
      !q ||
      book.title.toLowerCase().includes(q) ||
      (book.description || "").toLowerCase().includes(q) ||
      book.profiles?.username?.toLowerCase().includes(q) ||
      book.profiles?.display_name?.toLowerCase().includes(q)
  )

  return apiOk({
    items,
    total: items.length,
  })
}
