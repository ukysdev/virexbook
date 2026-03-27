import { apiError, apiOk } from "@/lib/api"
import { createClient } from "@/lib/supabase/server"
import type { NextRequest } from "next/server"

export async function GET(
  _request: NextRequest,
  context: { params: Promise<unknown> }
) {
  const { username } = (await context.params) as { username: string }
  const supabase = await createClient()

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .maybeSingle()

  if (error) {
    return apiError(error.message, 400)
  }

  if (!profile) {
    return apiError("Profile not found", 404)
  }

  const { count: publishedBooks } = await supabase
    .from("books")
    .select("*", { count: "exact", head: true })
    .eq("user_id", profile.id)
    .eq("status", "published")

  return apiOk({
    profile,
    stats: {
      published_books: publishedBooks || 0,
    },
  })
}
