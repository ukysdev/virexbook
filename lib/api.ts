import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export function apiOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ data }, init)
}

export function apiError(message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    {
      error: message,
      ...(details !== undefined ? { details } : {}),
    },
    { status }
  )
}

export async function getAuthenticatedContext() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return { supabase, user }
}

export function parseBooleanParam(value: string | null) {
  return value === "true" || value === "1"
}
