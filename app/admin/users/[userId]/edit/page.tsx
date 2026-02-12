"use client"

import React, { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { ArrowLeft } from "lucide-react"
import { uploadAssetFile } from "@/lib/upload-asset"

export default function AdminUserEdit() {
  const params = useParams()
  const router = useRouter()
  const userId = params.userId as string
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [username, setUsername] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [bio, setBio] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const [isStaff, setIsStaff] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const fetchProfile = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).single()
    if (!data) {
      toast.error("User not found")
      setLoading(false)
      return
    }
    setProfile(data)
    setUsername(data.username || "")
    setDisplayName(data.display_name || "")
    setBio(data.bio || "")
    setAvatarUrl(data.avatar_url || "")
    setIsAdmin(!!data.is_admin)
    setIsStaff(!!data.is_staff)
    setIsVerified(!!data.is_verified)
    setLoading(false)
  }, [userId])

  useEffect(() => { fetchProfile() }, [fetchProfile])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const supabase = createClient()

    let uploadedAvatarUrl: string | null = avatarUrl.trim() || null
    if (avatarFile) {
      try {
        uploadedAvatarUrl = await uploadAssetFile(avatarFile, "avatar")
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Avatar upload failed"
        toast.error(message)
        setIsLoading(false)
        return
      }
    }

    const { error } = await supabase.from("profiles").update({
      username: username.trim(),
      display_name: displayName.trim() || null,
      bio: bio.trim() || null,
      avatar_url: uploadedAvatarUrl,
      is_admin: isAdmin,
      is_staff: isStaff,
      is_verified: isVerified,
      updated_at: new Date().toISOString(),
    }).eq("id", userId)

    if (error) {
      toast.error(error.message)
      setIsLoading(false)
      return
    }

    toast.success("User updated")
    router.push("/admin")
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      setAvatarFile(null)
      setAvatarPreview("")
      return
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file")
      e.target.value = ""
      return
    }

    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleDelete = async () => {
    if (!confirm("Delete this user and all related data? This cannot be undone.")) return
    const supabase = createClient()
    // best-effort: delete related rows
    await supabase.from("likes").delete().eq("user_id", userId)
    await supabase.from("reading_lists").delete().eq("user_id", userId)
    await supabase.from("reading_progress").delete().eq("user_id", userId)
    await supabase.from("follows").delete().or(`follower_id.eq.${userId},following_id.eq.${userId}`)
    await supabase.from("comments").delete().eq("user_id", userId)
    await supabase.from("chapters").delete().eq("user_id", userId)
    const { error } = await supabase.from("profiles").delete().eq("id", userId)
    if (error) return toast.error(error.message)
    toast.success("User deleted")
    router.push("/admin")
  }

  if (loading) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-2xl px-4 py-8">Loading…</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Link href="/admin" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Admin
        </Link>

        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">Edit User (Admin)</h1>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6 rounded-xl border border-border bg-card p-6">
          <div className="grid gap-2">
            <Label>Username</Label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} className="bg-secondary" />
          </div>

          <div className="grid gap-2">
            <Label>Display name</Label>
            <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="bg-secondary" />
          </div>

          <div className="grid gap-2">
            <Label>Bio</Label>
            <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="bg-secondary" />
          </div>

          <div className="grid gap-2">
            <Label>Avatar Image</Label>
            <Input type="file" accept="image/*" onChange={handleAvatarChange} className="bg-secondary" />
            {(avatarPreview || avatarUrl) && (
              <div className="mt-2 h-20 w-20 overflow-hidden rounded-full border border-border">
                <img src={avatarPreview || avatarUrl || "/placeholder-user.jpg"} alt="Avatar preview" className="h-full w-full object-cover" />
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <label className="flex items-center gap-2"><input type="checkbox" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} /> Admin</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={isStaff} onChange={(e) => setIsStaff(e.target.checked)} /> Staff</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={isVerified} onChange={(e) => setIsVerified(e.target.checked)} /> Verified</label>
          </div>

          <div className="flex gap-3">
            <Button type="submit" className="bg-primary">Save</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete User</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
