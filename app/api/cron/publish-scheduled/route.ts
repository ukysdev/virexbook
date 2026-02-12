import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { getSupabaseEnv, getSupabaseServiceRoleKey } from "@/lib/env"

export async function POST(request: NextRequest) {
  try {
    const secret = request.headers.get("x-cron-secret")
    if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createClient(
      getSupabaseEnv().url,
      getSupabaseServiceRoleKey()
    )

    const now = new Date().toISOString()
    const { data: dueChapters, error: selectError } = await supabase
      .from("chapters")
      .select("id")
      .eq("status", "draft")
      .not("publish_at", "is", null)
      .lte("publish_at", now)
      .limit(500)

    if (selectError) {
      return NextResponse.json(
        { error: selectError.message },
        { status: 500 }
      )
    }

    if (!dueChapters || dueChapters.length === 0) {
      return NextResponse.json({ published: 0 }, { status: 200 })
    }

    const ids = dueChapters.map((chapter) => chapter.id)
    const { error: updateError } = await supabase
      .from("chapters")
      .update({
        status: "published",
        publish_at: null,
        updated_at: now,
      })
      .in("id", ids)

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ published: ids.length }, { status: 200 })
  } catch (error) {
    console.error("Scheduled publish cron failed", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
