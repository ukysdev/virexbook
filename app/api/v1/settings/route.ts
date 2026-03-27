import { apiError, apiOk, getAuthenticatedContext } from "@/lib/api"
import { defaultUserSettings, mergeUserSettings } from "@/lib/user-settings"

const allowedKeys = Object.keys(defaultUserSettings) as Array<
  keyof typeof defaultUserSettings
>

export async function GET() {
  const { supabase, user } = await getAuthenticatedContext()
  if (!user) {
    return apiError("Authentication required", 401)
  }

  const { data, error } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle()

  if (error) {
    return apiError(error.message, 400)
  }

  return apiOk({ settings: mergeUserSettings(user.id, data) })
}

export async function PATCH(request: Request) {
  const { supabase, user } = await getAuthenticatedContext()
  if (!user) {
    return apiError("Authentication required", 401)
  }

  const body = (await request.json()) || {}
  const updates = Object.fromEntries(
    Object.entries(body).filter(([key]) =>
      allowedKeys.includes(key as keyof typeof defaultUserSettings)
    )
  )

  const { data, error } = await supabase
    .from("user_settings")
    .upsert(
      {
        user_id: user.id,
        ...updates,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    )
    .select("*")
    .single()

  if (error) {
    return apiError(error.message, 400)
  }

  return apiOk({ settings: mergeUserSettings(user.id, data) })
}
