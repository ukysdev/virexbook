import { apiOk } from "@/lib/api"
import { createClient } from "@/lib/supabase/server"
import type { NextRequest } from "next/server"

export async function GET(
  request: NextRequest,
  context: { params: Promise<unknown> }
) {
  const { bookId } = (await context.params) as { bookId: string }
  const { searchParams } = new URL(request.url)
  const includeContent = searchParams.get("includeContent") === "true"
  const supabase = await createClient()

  const select = includeContent
    ? "id,title,content,order_index,word_count,audio_url,created_at,updated_at"
    : "id,title,order_index,word_count,audio_url,created_at,updated_at"

  const { data } = await supabase
    .from("chapters")
    .select(select)
    .eq("book_id", bookId)
    .eq("status", "published")
    .order("order_index", { ascending: true })

  return apiOk({
    items: data || [],
    total: data?.length || 0,
  })
}
