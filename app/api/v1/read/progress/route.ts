import { apiError, apiOk, getAuthenticatedContext } from "@/lib/api"

export async function GET(request: Request) {
  const { supabase, user } = await getAuthenticatedContext()
  if (!user) {
    return apiError("Authentication required", 401)
  }

  const { searchParams } = new URL(request.url)
  const bookId = searchParams.get("bookId")

  if (!bookId) {
    return apiError("Missing bookId", 400)
  }

  const { data, error } = await supabase
    .from("reading_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("book_id", bookId)
    .maybeSingle()

  if (error) {
    return apiError(error.message, 400)
  }

  return apiOk({ progress: data })
}

export async function PUT(request: Request) {
  const { supabase, user } = await getAuthenticatedContext()
  if (!user) {
    return apiError("Authentication required", 401)
  }

  const body = await request.json()
  const { book_id, chapter_id, scroll_position } = body || {}

  if (!book_id) {
    return apiError("Missing book_id", 400)
  }

  const { data, error } = await supabase
    .from("reading_progress")
    .upsert(
      {
        user_id: user.id,
        book_id,
        chapter_id: chapter_id || null,
        scroll_position:
          typeof scroll_position === "number" ? scroll_position : 0,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,book_id" }
    )
    .select("*")
    .single()

  if (error) {
    return apiError(error.message, 400)
  }

  return apiOk({ progress: data })
}
