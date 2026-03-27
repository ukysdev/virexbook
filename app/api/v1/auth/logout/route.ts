import { apiError, apiOk, getAuthenticatedContext } from "@/lib/api"

export async function POST() {
  const { supabase, user } = await getAuthenticatedContext()

  if (!user) {
    return apiError("Authentication required", 401)
  }

  const { error } = await supabase.auth.signOut()
  if (error) {
    return apiError(error.message, 400)
  }

  return apiOk({ message: "Logged out" })
}
