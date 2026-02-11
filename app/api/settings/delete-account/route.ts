import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

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

    // Store deletion request for audit trail
    const { error: insertError } = await supabase
      .from("deletion_requests")
      .insert([
        {
          id: uuidv4(),
          user_id: user.id,
          email: user.email,
          status: "pending",
          requested_at: new Date().toISOString(),
          scheduled_deletion_at: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(), // 30 days grace period
          metadata: {
            ip_address: request.headers.get("x-forwarded-for"),
            user_agent: request.headers.get("user-agent"),
          },
        },
      ])

    if (insertError) {
      console.error("Error creating deletion request:", insertError)
      return NextResponse.json(
        { error: "Error processing deletion request" },
        { status: 500 }
      )
    }

    // Delete all user data
    try {
      // Get all book IDs to cascade delete chapters and comments
      const { data: books } = await supabase
        .from("books")
        .select("id")
        .eq("user_id", user.id)

      if (books && books.length > 0) {
        const bookIds = books.map((b) => b.id)

        // Delete comments on user's chapters
        const { error: commentsError } = await supabase
          .from("comments")
          .delete()
          .in(
            "chapter_id",
            (
              await supabase
                .from("chapters")
                .select("id")
                .eq("user_id", user.id)
            ).data?.map((c) => c.id) || []
          )

        // Delete chapters
        const { error: chaptersError } = await supabase
          .from("chapters")
          .delete()
          .eq("user_id", user.id)

        // Delete books
        const { error: booksError } = await supabase
          .from("books")
          .delete()
          .eq("user_id", user.id)

        // Delete likes on user's books
        const { error: likesError } = await supabase
          .from("likes")
          .delete()
          .in("book_id", bookIds)
      }

      // Delete user comments
      const { error: userCommentsError } = await supabase
        .from("comments")
        .delete()
        .eq("user_id", user.id)

      // Delete follows (as follower)
      const { error: followsError } = await supabase
        .from("follows")
        .delete()
        .eq("follower_id", user.id)

      // Delete follows (as following)
      const { error: followingError } = await supabase
        .from("follows")
        .delete()
        .eq("following_id", user.id)

      // Delete profile
      const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", user.id)

      // Delete auth user
      const { error: authError } = await supabase.auth.admin.deleteUser(
        user.id
      )

      if (authError) {
        console.error("Error deleting auth user:", authError)
        // Update deletion request status to failed
        await supabase
          .from("deletion_requests")
          .update({ status: "failed" })
          .eq("user_id", user.id)

        return NextResponse.json(
          { error: "Error deleting account" },
          { status: 500 }
        )
      }

      // Update deletion request status to completed
      const { error: updateError } = await supabase
        .from("deletion_requests")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)

      return NextResponse.json(
        { message: "Account is being deleted..." },
        { status: 200 }
      )
    } catch (error) {
      console.error("Error deleting user data:", error)
      // Update deletion request status to failed
      await supabase
        .from("deletion_requests")
        .update({ status: "failed" })
        .eq("user_id", user.id)

      return NextResponse.json(
        { error: "Error deleting data" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Error in delete-account route:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
