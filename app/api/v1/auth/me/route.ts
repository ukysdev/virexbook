import { apiError, apiOk, getAuthenticatedContext } from "@/lib/api"
import { mergeUserSettings } from "@/lib/user-settings"

export async function GET() {
  const { supabase, user } = await getAuthenticatedContext()

  if (!user) {
    return apiError("Authentication required", 401)
  }

  const [profileRes, settingsRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("user_settings").select("*").eq("user_id", user.id).maybeSingle(),
  ])

  return apiOk({
    user: {
      id: user.id,
      email: user.email,
      last_sign_in_at: user.last_sign_in_at,
    },
    profile: profileRes.data,
    settings: mergeUserSettings(user.id, settingsRes.data),
  })
}
