import type { UserSettings } from "@/lib/types"

export const defaultUserSettings: Omit<
  UserSettings,
  "user_id" | "created_at" | "updated_at"
> = {
  preferred_language: "de",
  theme: "system",
  autoplay_audio: false,
  email_notifications: true,
  marketing_emails: false,
  analytics_enabled: true,
  public_profile: true,
  show_reading_activity: true,
  mature_content: false,
}

export function mergeUserSettings(
  userId: string,
  settings?: Partial<UserSettings> | null
): UserSettings {
  return {
    user_id: userId,
    ...defaultUserSettings,
    ...(settings || {}),
  }
}
