"use client"

import { useEffect, useState } from "react"
import { Loader2, Save, Settings2 } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { UserSettings } from "@/lib/types"

type SettingsResponse = {
  data?: {
    settings: UserSettings
  }
  error?: string
}

const fallbackSettings: UserSettings = {
  user_id: "",
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

export default function PreferencesSettingsPage() {
  const [settings, setSettings] = useState<UserSettings>(fallbackSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function loadSettings() {
      const response = await fetch("/api/v1/settings")
      const payload = (await response.json()) as SettingsResponse

      if (!response.ok || !payload.data?.settings) {
        toast.error(payload.error || "Could not load settings")
        setLoading(false)
        return
      }

      setSettings(payload.data.settings)
      setLoading(false)
    }

    loadSettings()
  }, [])

  async function saveSettings() {
    setSaving(true)

    const response = await fetch("/api/v1/settings", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        preferred_language: settings.preferred_language,
        theme: settings.theme,
        autoplay_audio: settings.autoplay_audio,
        email_notifications: settings.email_notifications,
        marketing_emails: settings.marketing_emails,
        analytics_enabled: settings.analytics_enabled,
        public_profile: settings.public_profile,
        show_reading_activity: settings.show_reading_activity,
        mature_content: settings.mature_content,
      }),
    })

    const payload = (await response.json()) as SettingsResponse

    if (!response.ok || !payload.data?.settings) {
      toast.error(payload.error || "Could not save settings")
      setSaving(false)
      return
    }

    setSettings(payload.data.settings)
    toast.success("Settings saved")
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading preferences...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            <CardTitle>Preferences</CardTitle>
          </div>
          <CardDescription>
            Manage your personal reading, privacy, and notification preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Preferred Language</Label>
              <Select
                value={settings.preferred_language}
                onValueChange={(value) =>
                  setSettings((current) => ({ ...current, preferred_language: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Theme</Label>
              <Select
                value={settings.theme}
                onValueChange={(value: UserSettings["theme"]) =>
                  setSettings((current) => ({ ...current, theme: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <PreferenceToggle
            title="Autoplay audiobook audio"
            description="Start chapter audio automatically when available."
            checked={settings.autoplay_audio}
            onCheckedChange={(checked) =>
              setSettings((current) => ({ ...current, autoplay_audio: checked }))
            }
          />
          <PreferenceToggle
            title="Email notifications"
            description="Receive important account and platform notifications via email."
            checked={settings.email_notifications}
            onCheckedChange={(checked) =>
              setSettings((current) => ({ ...current, email_notifications: checked }))
            }
          />
          <PreferenceToggle
            title="Marketing emails"
            description="Allow updates about releases, campaigns, and curated recommendations."
            checked={settings.marketing_emails}
            onCheckedChange={(checked) =>
              setSettings((current) => ({ ...current, marketing_emails: checked }))
            }
          />
          <PreferenceToggle
            title="Analytics"
            description="Help improve the platform by sharing anonymous usage data."
            checked={settings.analytics_enabled}
            onCheckedChange={(checked) =>
              setSettings((current) => ({ ...current, analytics_enabled: checked }))
            }
          />
          <PreferenceToggle
            title="Public profile"
            description="Allow other readers to discover your profile and public books."
            checked={settings.public_profile}
            onCheckedChange={(checked) =>
              setSettings((current) => ({ ...current, public_profile: checked }))
            }
          />
          <PreferenceToggle
            title="Show reading activity"
            description="Expose progress and reading activity to future social features."
            checked={settings.show_reading_activity}
            onCheckedChange={(checked) =>
              setSettings((current) => ({ ...current, show_reading_activity: checked }))
            }
          />
          <PreferenceToggle
            title="Enable mature content"
            description="Include mature titles in discovery and recommendation contexts."
            checked={settings.mature_content}
            onCheckedChange={(checked) =>
              setSettings((current) => ({ ...current, mature_content: checked }))
            }
          />

          <Button onClick={saveSettings} disabled={saving} className="w-full sm:w-auto">
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Preferences
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function PreferenceToggle({
  title,
  description,
  checked,
  onCheckedChange,
}: {
  title: string
  description: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-4">
      <div className="space-y-1">
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}
