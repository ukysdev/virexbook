import { apiOk, parseBooleanParam } from "@/lib/api"
import { extractAudiobookBookIds, markBooksAsAudiobooks } from "@/lib/audiobooks"
import { createClient } from "@/lib/supabase/server"
import type { Book } from "@/lib/types"

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const q = searchParams.get("q")?.trim().toLowerCase() || ""
  const genre = searchParams.get("genre")
  const audiobookOnly = parseBooleanParam(searchParams.get("audiobookOnly"))
  const featured = parseBooleanParam(searchParams.get("featured"))
  const originals = parseBooleanParam(searchParams.get("originals"))
  const staffPicks = parseBooleanParam(searchParams.get("staffPicks"))
  const sort = searchParams.get("sort") === "popular" ? "popular" : "newest"
  const limit = Math.min(Number(searchParams.get("limit") || "24"), 100)

  let audiobookBookIds: string[] = []

  if (audiobookOnly) {
    const { data: audioRows } = await supabase
      .from("chapters")
      .select("book_id")
      .eq("status", "published")
      .not("audio_url", "is", null)
      .limit(5000)

    audiobookBookIds = extractAudiobookBookIds(audioRows)

    if (audiobookBookIds.length === 0) {
      return apiOk({ items: [], total: 0 })
    }
  }

  let query = supabase
    .from("books")
    .select("*, profiles(*)")
    .eq("status", "published")
    .limit(limit)

  if (genre && genre !== "All") {
    query = query.eq("genre", genre)
  }
  if (featured) query = query.eq("is_featured", true)
  if (originals) query = query.eq("is_original", true)
  if (staffPicks) query = query.eq("is_staff_pick", true)
  if (audiobookOnly) query = query.in("id", audiobookBookIds)

  query =
    sort === "popular"
      ? query.order("view_count", { ascending: false })
      : query.order("created_at", { ascending: false })

  const { data } = await query
  const items = ((data || []) as Book[]).filter((book) => {
    if (!q) return true
    return (
      book.title.toLowerCase().includes(q) ||
      (book.description || "").toLowerCase().includes(q) ||
      (book.tags || []).some((tag) => tag.toLowerCase().includes(q)) ||
      book.profiles?.username?.toLowerCase().includes(q) ||
      book.profiles?.display_name?.toLowerCase().includes(q)
    )
  })

  return apiOk({
    items: audiobookOnly ? markBooksAsAudiobooks(items, audiobookBookIds) : items,
    total: items.length,
  })
}
