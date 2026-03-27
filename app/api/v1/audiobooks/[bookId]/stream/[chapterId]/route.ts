import { apiError } from "@/lib/api"
import { createClient } from "@/lib/supabase/server"
import { NextResponse, type NextRequest } from "next/server"

export async function GET(
  _request: NextRequest,
  context: { params: Promise<unknown> }
) {
  const { bookId, chapterId } = (await context.params) as {
    bookId: string
    chapterId: string
  }
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("chapters")
    .select("id, book_id, title, audio_url, status")
    .eq("id", chapterId)
    .eq("book_id", bookId)
    .eq("status", "published")
    .maybeSingle()

  if (error) {
    return apiError(error.message, 400)
  }

  if (!data?.audio_url) {
    return apiError("Audio stream not found", 404)
  }

  return NextResponse.redirect(data.audio_url, { status: 307 })
}
