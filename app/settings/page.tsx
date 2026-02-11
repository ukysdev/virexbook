"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Mail, Lock, ToggleRight, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface UserData {
  email?: string
  user_metadata?: {
    avatar_url?: string
  }
}

export default function SettingsPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUser() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    fetchUser()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Lädt...</div>
  }

  return (
    <div className="space-y-8">
      {/* Account Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Account Summary</CardTitle>
          <CardDescription>Overview of your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback>AC</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user?.email}</p>
              <p className="text-sm text-muted-foreground">Primary Email</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Sections */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Account Settings */}
        <Card className="hover:border-primary/50 transition-colors cursor-pointer">
          <Link href="/settings/account" className="block">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <CardTitle>Account</CardTitle>
              </div>
              <CardDescription>Manage email and password</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Manage Account →
              </Button>
            </CardContent>
          </Link>
        </Card>

        {/* Privacy Settings */}
        <Card className="hover:border-primary/50 transition-colors cursor-pointer">
          <Link href="/settings/privacy" className="block">
            <CardHeader>
              <div className="flex items-center gap-2">
                <ToggleRight className="h-4 w-4" />
                <CardTitle>Privacy</CardTitle>
              </div>
              <CardDescription>Data export and GDPR rights</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Privacy Settings →
              </Button>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Danger Zone */}
      <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
        <Link href="/settings/danger">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
            </div>
            <CardDescription>Delete account and other critical actions</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full border-red-200 hover:bg-red-100 dark:hover:bg-red-900/20">
              Critical Actions →
            </Button>
          </CardContent>
        </Link>
      </Card>
    </div>
  )
}
