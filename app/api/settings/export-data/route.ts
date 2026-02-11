import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Authentifizierung erforderlich" },
        { status: 401 }
      )
    }

    // Fetch user profile data
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    // Fetch user books
    const { data: books } = await supabase
      .from("books")
      .select("*")
      .eq("user_id", user.id)

    // Fetch user chapters
    const { data: chapters } = await supabase
      .from("chapters")
      .select("*")
      .eq("user_id", user.id)

    // Fetch user comments
    const { data: comments } = await supabase
      .from("comments")
      .select("*")
      .eq("user_id", user.id)

    // Fetch following data
    const { data: following } = await supabase
      .from("follows")
      .select("following_id")
      .eq("follower_id", user.id)

    // Fetch followers data
    const { data: followers } = await supabase
      .from("follows")
      .select("follower_id")
      .eq("following_id", user.id)

    const exportData = {
      exportDate: new Date().toISOString(),
      dataVersion: "1.0",
      gdprCompliance: {
        description: "Complete data export according to GDPR Article 20",
        exportedAt: new Date().toISOString(),
        personalDataIncluded: true,
      },
      user: {
        id: user.id,
        email: user.email,
        emailVerified: user.email_confirmed_at,
        createdAt: user.created_at,
        lastSignInAt: user.last_sign_in_at,
      },
      profile,
      books,
      chapters,
      comments,
      following: following || [],
      followers: followers || [],
    }

    return NextResponse.json(exportData, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="virexbooks-data-${new Date().toISOString().split('T')[0]}.json"`,
      },
    })
  } catch (error) {
    console.error("Error exporting data:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
