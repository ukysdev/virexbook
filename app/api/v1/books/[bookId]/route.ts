import { apiError, apiOk } from "@/lib/api"
import { createClient } from "@/lib/supabase/server"
import type { NextRequest } from "next/server"

export async function GET(
  _request: NextRequest,
  context: { params: Promise<unknown> }
) {
  const { bookId } = (await context.params) as { bookId: string }
  const supabase = await createClient()

  const [bookRes, chaptersRes] = await Promise.all([
    supabase.from("books").select("*, profiles(*)").eq("id", bookId).maybeSingle(),
    supabase
      .from("chapters")
      .select("id, title, order_index, word_count, audio_url, created_at")
      .eq("book_id", bookId)
      .eq("status", "published")
      .order("order_index", { ascending: true }),
  ])

  if (bookRes.error) {
    return apiError(bookRes.error.message, 400)
  }

  if (!bookRes.data) {
    return apiError("Book not found", 404)
  }

  const audioChapters = (chaptersRes.data || []).filter((chapter) => chapter.audio_url)

  return apiOk({
    book: {
      ...bookRes.data,
      has_audio: audioChapters.length > 0,
      audio_chapter_count: audioChapters.length,
    },
    chapters: chaptersRes.data || [],
  })
}
