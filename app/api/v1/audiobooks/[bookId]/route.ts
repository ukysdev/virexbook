import { apiError, apiOk } from "@/lib/api"
import { createClient } from "@/lib/supabase/server"
import type { NextRequest } from "next/server"

export async function GET(
  _request: NextRequest,
  context: { params: Promise<unknown> }
) {
  const { bookId } = (await context.params) as { bookId: string }
  const supabase = await createClient()

  const [bookRes, chapterRes] = await Promise.all([
    supabase.from("books").select("*, profiles(*)").eq("id", bookId).maybeSingle(),
    supabase
      .from("chapters")
      .select("id, title, order_index, word_count, audio_url, created_at")
      .eq("book_id", bookId)
      .eq("status", "published")
      .not("audio_url", "is", null)
      .order("order_index", { ascending: true }),
  ])

  if (!bookRes.data) {
    return apiError("Audiobook not found", 404)
  }

  return apiOk({
    book: {
      ...bookRes.data,
      has_audio: true,
      audio_chapter_count: chapterRes.data?.length || 0,
    },
    audio_chapters: chapterRes.data || [],
  })
}
