"use client"

import React, { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { toast } from "sonner"
import type { Book, Profile } from "@/lib/types"
import { Trash2, Globe, User } from "lucide-react"

export default function AdminPage() {
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [books, setBooks] = useState<Book[]>([])
  const [users, setUsers] = useState<Profile[]>([])
  const [chapters, setChapters] = useState<any[]>([])
  const [comments, setComments] = useState<any[]>([])
  const [likes, setLikes] = useState<any[]>([])
  const [follows, setFollows] = useState<any[]>([])
  const [readingLists, setReadingLists] = useState<any[]>([])

  const fetchData = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setIsAdmin(false)
      setLoading(false)
      return
    }

    // read profile to check is_admin
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()
    if (!profile || !(profile as any).is_admin) {
      setIsAdmin(false)
      setLoading(false)
      return
    }

    setIsAdmin(true)

    const [booksRes, usersRes, chaptersRes, commentsRes, likesRes, followsRes, readingListsRes] = await Promise.all([
      supabase.from("books").select("*, profiles(*)").order("created_at", { ascending: false }).limit(200),
      supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(200),
      supabase.from("chapters").select("*").order("created_at", { descending: true }).limit(200),
      supabase.from("comments").select("*, profiles(*)").order("created_at", { descending: true }).limit(200),
      supabase.from("likes").select("*" ).order("created_at", { descending: true }).limit(200),
      supabase.from("follows").select("*" ).order("created_at", { descending: true }).limit(200),
      supabase.from("reading_lists").select("*" ).order("created_at", { descending: true }).limit(200),
    ])

    setBooks((booksRes.data || []) as Book[])
    setUsers((usersRes.data || []) as Profile[])
    setChapters(chaptersRes.data || [])
    setComments(commentsRes.data || [])
    setLikes(likesRes.data || [])
    setFollows(followsRes.data || [])
    setReadingLists(readingListsRes.data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refetch = async () => fetchData()

  const togglePublish = async (b: Book) => {
    const supabase = createClient()
    const newStatus = b.status === "published" ? "draft" : "published"
    const { error } = await supabase.from("books").update({ status: newStatus, updated_at: new Date().toISOString() }).eq("id", b.id)
    if (error) return toast.error(error.message)
    toast.success(`Book ${newStatus}`)
    await refetch()
  }

  const deleteBook = async (id: string) => {
    if (!confirm("Delete this book and its chapters? This cannot be undone.")) return
    const supabase = createClient()
    // attempt delete chapters first (best-effort)
    await supabase.from("chapters").delete().eq("book_id", id)
    const { error } = await supabase.from("books").delete().eq("id", id)
    if (error) return toast.error(error.message)
    toast.success("Book deleted")
    await refetch()
  }

  const toggleAdmin = async (u: Profile) => {
    const supabase = createClient()
    const { error } = await supabase.from("profiles").update({ is_admin: !u.is_admin }).eq("id", u.id)
    if (error) return toast.error(error.message)
    toast.success(`User ${!u.is_admin ? "granted" : "revoked"} admin`) 
    await refetch()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-6xl px-4 py-8">Loading admin…</div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-4xl px-4 py-12 text-center">
          <h2 className="text-xl font-semibold text-foreground">Nicht autorisiert</h2>
          <p className="text-sm text-muted-foreground mt-2">Nur Admins können dieses Dashboard einsehen.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-foreground">Books ({books.length})</h2>
            </div>

            <div className="space-y-3">
              {books.map((b) => (
                <div key={b.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <div className="flex-1 min-w-0">
                    <Link href={`/book/${b.id}`} className="font-medium text-foreground hover:text-primary line-clamp-1">{b.title}</Link>
                    <div className="text-xs text-muted-foreground">{b.profiles?.display_name || b.profiles?.username} · {b.genre}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/books/${b.id}/edit`}>
                      <Button variant="outline" className="text-sm">Edit</Button>
                    </Link>
                    <Badge className={`text-[11px] border-0 ${b.status==="published"?"bg-emerald-500/15 text-emerald-400":"bg-secondary text-muted-foreground"}`}>{b.status}</Badge>
                    <Button variant="ghost" onClick={() => togglePublish(b)} className="text-sm">{b.status === "published" ? "Unpublish" : "Publish"}</Button>
                    <Button variant="destructive" onClick={() => deleteBook(b.id)} className="text-sm"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2"><User className="h-4 w-4"/> Users ({users.length})</h2>
            </div>

            <div className="space-y-3">
              {users.map((u) => (
                <div key={u.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={u.avatar_url || ""} />
                    <AvatarFallback>{(u.display_name||u.username||'U')[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground line-clamp-1">{u.display_name || u.username}</div>
                    <div className="text-xs text-muted-foreground">{u.username}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/users/${u.id}/edit`}>
                      <Button variant="outline" className="text-sm">Edit</Button>
                    </Link>
                    <Badge className={`text-[11px] border-0 ${u.is_admin?"bg-amber-500/15 text-amber-400":"bg-secondary text-muted-foreground"}`}>{u.is_admin?"Admin":"User"}</Badge>
                    <Button variant="outline" onClick={() => toggleAdmin(u)} className="text-sm">{u.is_admin?"Revoke":"Grant"}</Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Extra management sections */}
        <div className="mt-6 grid grid-cols-1 gap-6">
          <section className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-lg font-semibold mb-3">Chapters ({chapters.length})</h3>
            <div className="space-y-2">
              {chapters.map((c) => (
                <div key={c.id} className="flex items-center justify-between gap-3 p-2 border border-border rounded">
                  <div className="min-w-0">
                    <div className="font-medium line-clamp-1">{c.title}</div>
                    <div className="text-xs text-muted-foreground">{c.word_count} words • {new Date(c.created_at).toLocaleString()}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/write/${c.book_id}/chapter/${c.id}`}>
                      <Button variant="outline" size="sm">Edit</Button>
                    </Link>
                    <Button variant="destructive" onClick={async () => { if(confirm('Delete chapter?')){ const s=createClient(); await s.from('chapters').delete().eq('id', c.id); await refetch(); }}}>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-lg font-semibold mb-3">Comments ({comments.length})</h3>
            <div className="space-y-2">
              {comments.map((cm) => (
                <div key={cm.id} className="flex items-start justify-between gap-3 p-2 border border-border rounded">
                  <div className="min-w-0">
                    <div className="text-sm">{cm.content}</div>
                    <div className="text-xs text-muted-foreground">by {cm.profiles?.display_name || cm.profiles?.username} • {new Date(cm.created_at).toLocaleString()}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="destructive" onClick={async () => { if(confirm('Delete comment?')){ const s=createClient(); await s.from('comments').delete().eq('id', cm.id); await refetch(); }}}>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-lg font-semibold mb-3">Likes ({likes.length})</h3>
            <div className="space-y-2">
              {likes.map((l) => (
                <div key={l.id} className="flex items-center justify-between gap-3 p-2 border border-border rounded">
                  <div className="min-w-0 text-sm">Like by {l.user_id} on book {l.book_id}</div>
                  <Button variant="destructive" onClick={async () => { if(confirm('Delete like?')){ const s=createClient(); await s.from('likes').delete().eq('id', l.id); await refetch(); }}}>Delete</Button>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-lg font-semibold mb-3">Follows ({follows.length})</h3>
            <div className="space-y-2">
              {follows.map((f) => (
                <div key={f.id} className="flex items-center justify-between gap-3 p-2 border border-border rounded">
                  <div className="min-w-0 text-sm">{f.follower_id} → {f.following_id}</div>
                  <Button variant="destructive" onClick={async () => { if(confirm('Delete follow?')){ const s=createClient(); await s.from('follows').delete().eq('id', f.id); await refetch(); }}}>Delete</Button>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-lg font-semibold mb-3">Reading Lists ({readingLists.length})</h3>
            <div className="space-y-2">
              {readingLists.map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-3 p-2 border border-border rounded">
                  <div className="min-w-0 text-sm">User {r.user_id} saved book {r.book_id}</div>
                  <Button variant="destructive" onClick={async () => { if(confirm('Delete reading list entry?')){ const s=createClient(); await s.from('reading_lists').delete().eq('id', r.id); await refetch(); }}}>Delete</Button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
