"use client"

import { createClient } from "@/lib/supabase/client"
import { Navbar } from "@/components/navbar"
import { BookCard } from "@/components/book-card"
import { VirexBadge } from "@/components/virex-badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useParams } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import type { Profile, Book } from "@/lib/types"
import {
  Users,
  BookOpen,
  Calendar,
  PenTool,
  Save,
  X,
  UserPlus,
  UserMinus,
} from "lucide-react"
import { toast } from "sonner"

export default function ProfilePage() {
  const params = useParams()
  const username = params.username as string
  const [profile, setProfile] = useState<Profile | null>(null)
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [isOwner, setIsOwner] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const [editDisplayName, setEditDisplayName] = useState("")
  const [editBio, setEditBio] = useState("")
  const [editAvatarUrl, setEditAvatarUrl] = useState("")
  const [followerCount, setFollowerCount] = useState(0)

  const fetchData = useCallback(async () => {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) setCurrentUserId(user.id)

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", username)
      .single()

    if (!profileData) {
      setLoading(false)
      return
    }

    const prof = profileData as Profile
    setProfile(prof)
    setFollowerCount(prof.follower_count)
    setEditDisplayName(prof.display_name || "")
    setEditBio(prof.bio || "")
    setEditAvatarUrl(prof.avatar_url || "")

    if (user && user.id === prof.id) {
      setIsOwner(true)
    }

    const { data: booksData } = await supabase
      .from("books")
      .select("*, profiles(*)")
      .eq("user_id", prof.id)
      .eq("status", "published")
      .order("created_at", { ascending: false })

    if (booksData) setBooks(booksData as Book[])

    // Check following
    if (user && user.id !== prof.id) {
      const { data: followData } = await supabase
        .from("follows")
        .select("id")
        .eq("follower_id", user.id)
        .eq("following_id", prof.id)
        .single()

      if (followData) setIsFollowing(true)
    }

    setLoading(false)
  }, [username])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const toggleFollow = async () => {
    if (!currentUserId || !profile) {
      toast.error("Log in to follow authors")
      return
    }

    const supabase = createClient()

    if (isFollowing) {
      await supabase
        .from("follows")
        .delete()
        .eq("follower_id", currentUserId)
        .eq("following_id", profile.id)

      setIsFollowing(false)
      setFollowerCount((prev) => Math.max(0, prev - 1))

      await supabase
        .from("profiles")
        .update({ follower_count: Math.max(0, followerCount - 1) })
        .eq("id", profile.id)
    } else {
      await supabase
        .from("follows")
        .insert({ follower_id: currentUserId, following_id: profile.id })

      setIsFollowing(true)
      setFollowerCount((prev) => prev + 1)

      await supabase
        .from("profiles")
        .update({ follower_count: followerCount + 1 })
        .eq("id", profile.id)
    }
  }

  const saveProfile = async () => {
    if (!profile) return
    const supabase = createClient()

    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: editDisplayName.trim() || null,
        bio: editBio.trim() || null,
        avatar_url: editAvatarUrl.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id)

    if (error) {
      toast.error("Failed to save")
      return
    }

    setProfile({
      ...profile,
      display_name: editDisplayName.trim() || null,
      bio: editBio.trim() || null,
      avatar_url: editAvatarUrl.trim() || null,
    })
    setEditing(false)
    toast.success("Profile updated!")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="animate-pulse">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-secondary" />
              <div className="space-y-3">
                <div className="h-6 w-48 bg-secondary rounded" />
                <div className="h-4 w-32 bg-secondary rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-20">
          <h2 className="text-xl font-semibold text-foreground">
            Author not found
          </h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Profile header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <Avatar className="h-20 w-20 border-2 border-border mx-auto md:mx-0">
            <AvatarImage src={profile.avatar_url || ""} />
            <AvatarFallback className="bg-secondary text-secondary-foreground text-2xl">
              {profile.display_name?.[0]?.toUpperCase() ||
                profile.username[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <h1 className="font-display text-2xl font-bold text-foreground">
                {profile.display_name || profile.username}
              </h1>
              {profile.is_verified && <VirexBadge type="verified" size="sm" />}
              {profile.is_staff && <VirexBadge type="admin" size="sm" />}
            </div>

            <p className="mt-0.5 text-sm text-muted-foreground">
              @{profile.username}
            </p>

            {profile.bio && (
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-lg">
                {profile.bio}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground md:justify-start">
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                {followerCount} Followers
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                {profile.following_count} Following
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" />
                {books.length} Books
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                Joined{" "}
                {new Date(profile.created_at).toLocaleDateString("de-DE", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            {/* Actions */}
            <div className="mt-4 flex items-center justify-center gap-2 md:justify-start">
              {isOwner ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditing(!editing)}
                  className="gap-2 border-border text-foreground hover:bg-secondary"
                >
                  {editing ? (
                    <>
                      <X className="h-4 w-4" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <PenTool className="h-4 w-4" />
                      Edit Profile
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  variant={isFollowing ? "outline" : "default"}
                  size="sm"
                  onClick={toggleFollow}
                  className={
                    isFollowing
                      ? "gap-2 border-border text-foreground hover:bg-secondary"
                      : "gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  }
                >
                  {isFollowing ? (
                    <>
                      <UserMinus className="h-4 w-4" />
                      Unfollow
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />
                      Follow
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Edit form */}
        {editing && (
          <div className="mt-6 rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="grid gap-2">
              <Label className="text-foreground">Display Name</Label>
              <Input
                value={editDisplayName}
                onChange={(e) => setEditDisplayName(e.target.value)}
                className="bg-secondary border-border text-foreground"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-foreground">Bio</Label>
              <Textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                rows={3}
                className="bg-secondary border-border text-foreground resize-none"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-foreground">Avatar URL</Label>
              <Input
                value={editAvatarUrl}
                onChange={(e) => setEditAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <Button
              onClick={saveProfile}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        )}

        {/* Published books */}
        <div className="mt-10">
          <h2 className="font-display text-xl font-bold text-foreground mb-4">
            Published Stories
          </h2>
          {books.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center">
              <BookOpen className="mb-3 h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No published stories yet
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
