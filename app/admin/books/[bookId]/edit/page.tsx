"use client"

import React, { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { GENRES } from "@/lib/types"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { BookOpen, ArrowLeft } from "lucide-react"

export default function AdminBookEdit() {
  const params = useParams()
  const router = useRouter()
  const bookId = params.bookId as string
  const [loading, setLoading] = useState(true)
  const [book, setBook] = useState<any>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [genre, setGenre] = useState("Other")
  const [coverUrl, setCoverUrl] = useState("")
  const [tags, setTags] = useState("")
  const [status, setStatus] = useState("draft")
  const [isLoading, setIsLoading] = useState(false)

  const fetchBook = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase.from("books").select("*").eq("id", bookId).single()
    if (!data) {
      toast.error("Book not found")
      setLoading(false)
      return
    }
    setBook(data)
    setTitle(data.title || "")
    setDescription(data.description || "")
    setGenre(data.genre || "Other")
    setCoverUrl(data.cover_url || "")
    setTags((data.tags || []).join(", "))
    setStatus(data.status || "draft")
    setLoading(false)
  }, [bookId])

  useEffect(() => { fetchBook() }, [fetchBook])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from("books").update({
      title: title.trim(),
      description: description.trim() || null,
      genre,
      cover_url: coverUrl.trim() || null,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      status,
      updated_at: new Date().toISOString(),
    }).eq("id", bookId)

    if (error) {
      toast.error(error.message)
      setIsLoading(false)
      return
    }
    toast.success("Book updated")
    router.push("/admin")
  }

  const handleDelete = async () => {
    if (!confirm("Delete this book and its chapters? This cannot be undone.")) return
    const supabase = createClient()
    await supabase.from("chapters").delete().eq("book_id", bookId)
    const { error } = await supabase.from("books").delete().eq("id", bookId)
    if (error) return toast.error(error.message)
    toast.success("Book deleted")
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
          <h1 className="font-display text-3xl font-bold text-foreground">Edit Book (Admin)</h1>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6 rounded-xl border border-border bg-card p-6">
          <div className="grid gap-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" required value={title} onChange={(e) => setTitle(e.target.value)} className="bg-secondary" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="bg-secondary" />
          </div>

          <div className="grid gap-2">
            <Label>Genre</Label>
            <Input value={genre} onChange={(e) => setGenre(e.target.value)} className="bg-secondary" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="cover">Cover URL</Label>
            <Input id="cover" value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} className="bg-secondary" />
          </div>

          <div className="grid gap-2">
            <Label>Tags</Label>
            <Input value={tags} onChange={(e) => setTags(e.target.value)} className="bg-secondary" />
          </div>

          <div className="grid gap-2">
            <Label>Status</Label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="bg-secondary border-border p-2 rounded">
              <option value="draft">draft</option>
              <option value="published">published</option>
              <option value="archived">archived</option>
            </select>
          </div>

          <div className="flex gap-3">
            <Button type="submit" className="bg-primary">Save</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
