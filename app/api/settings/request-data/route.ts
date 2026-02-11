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

    // Store data request in database for audit trail
    const { error: insertError } = await supabase
      .from("data_requests")
      .insert([
        {
          id: uuidv4(),
          user_id: user.id,
          request_type: "article_15",
          email: user.email,
          status: "pending",
          requested_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
          metadata: {
            ip_address: request.headers.get("x-forwarded-for"),
            user_agent: request.headers.get("user-agent"),
          },
        },
      ])

    if (insertError) {
      console.error("Error creating data request record:", insertError)
      // Continue anyway, just log the error
    }

    // TODO: Send email to user with confirmation link
    // In production, integrate with your email service here

    return NextResponse.json(
      {
        message: "Datenanforderung eingereicht",
        details:
          "Du erhältst deine Daten innerhalb von 30 Tagen per E-Mail",
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error requesting data:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
