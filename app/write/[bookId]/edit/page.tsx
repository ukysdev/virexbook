"use client"

import React from "react"

import { createClient } from "@/lib/supabase/client"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { GENRES } from "@/lib/types"
import { useRouter, useParams } from "next/navigation"
import { useState, useEffect, useCallback } from "react"
import { BookOpen, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { uploadAssetFile } from "@/lib/upload-asset"

export default function EditBookPage() {
  const router = useRouter()
  const params = useParams()
  const bookId = params.bookId as string

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [genre, setGenre] = useState("Other")
  const [coverUrl, setCoverUrl] = useState("")
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState("")
  const [tags, setTags] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  const fetchBook = useCallback(async () => {
    const supabase = createClient()
    const { data: bookRes } = await supabase.from("books").select("*").eq("id", bookId).single()
    const { data: { user } } = await supabase.auth.getUser()

    if (!bookRes) {
      toast.error("Book not found")
      setLoading(false)
      return
    }

    const book = bookRes as any
    setTitle(book.title || "")
    setDescription(book.description || "")
    setGenre(book.genre || "Other")
    setCoverUrl(book.cover_url || "")
    setTags((book.tags || []).join(", "))

    if (user && user.id === book.user_id) setAuthorized(true)
    setLoading(false)
  }, [bookId])

  useEffect(() => {
    fetchBook()
  }, [fetchBook])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error("You must be logged in")
      setIsLoading(false)
      return
    }

    if (!authorized) {
      toast.error("Not authorized to edit this book")
      setIsLoading(false)
      return
    }

    let uploadedCoverUrl: string | null = coverUrl.trim() || null

    if (coverFile) {
      try {
        uploadedCoverUrl = await uploadAssetFile(coverFile, "book-cover")
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Cover upload failed"
        toast.error(message)
        setIsLoading(false)
        return
      }
    }

    const { error } = await supabase
      .from("books")
      .update({
        title: title.trim(),
        description: description.trim() || null,
        genre,
        cover_url: uploadedCoverUrl,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        updated_at: new Date().toISOString(),
      })
      .eq("id", bookId)

    if (error) {
      toast.error(error.message)
      setIsLoading(false)
      return
    }

    toast.success("Book updated")
    router.push(`/write/${bookId}`)
  }

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      setCoverFile(null)
      setCoverPreview("")
      return
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file")
      e.target.value = ""
      return
    }

    setCoverFile(file)
    const objectUrl = URL.createObjectURL(file)
    setCoverPreview(objectUrl)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-2xl px-4 py-8">Loading…</div>
      </div>
    )
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-2xl px-4 py-8 text-center">
          <h2 className="text-xl font-semibold text-foreground">Nicht autorisiert</h2>
          <p className="text-sm text-muted-foreground mt-2">Nur der Autor kann die Buchdetails bearbeiten.</p>
          <Link href="/dashboard" className="mt-4 inline-block">
            <Button className="bg-primary text-primary-foreground">Zurück</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-2xl px-4 py-8">
        <Link
          href={`/write/${bookId}`}
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Book
        </Link>

        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">Edit Book</h1>
          <p className="mt-1 text-muted-foreground">Update the book details below.</p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6 rounded-xl border border-border bg-card p-6">
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-foreground">Title *</Label>
            <Input id="title" required value={title} onChange={(e) => setTitle(e.target.value)} className="bg-secondary border-border text-foreground placeholder:text-muted-foreground" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description" className="text-foreground">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="bg-secondary border-border text-foreground placeholder:text-muted-foreground resize-none" />
          </div>

          <div className="grid gap-2">
            <Label className="text-foreground">Genre *</Label>
            <Select value={genre} onValueChange={(v) => setGenre(v)}>
              <SelectTrigger className="bg-secondary border-border text-foreground"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-card border-border">
                {GENRES.map((g) => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="cover" className="text-foreground">Cover Image</Label>
            <Input id="cover" type="file" accept="image/*" onChange={handleCoverChange} className="bg-secondary border-border text-foreground placeholder:text-muted-foreground" />
            {(coverPreview || coverUrl) && (
              <div className="mt-2 w-32 overflow-hidden rounded-lg border border-border">
                <img src={coverPreview || coverUrl || "/placeholder.svg"} alt="Cover preview" className="aspect-[3/4] w-full object-cover" onError={(e) => { e.currentTarget.style.display = "none" }} />
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tags" className="text-foreground">Tags</Label>
            <Input id="tags" placeholder="romance, fantasy, adventure (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} className="bg-secondary border-border text-foreground placeholder:text-muted-foreground" />
          </div>

          <Button type="submit" className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading || !title.trim()}>
            <BookOpen className="h-4 w-4" />
            {isLoading ? "Updating..." : "Update Book"}
          </Button>
        </form>
      </div>
    </div>
  )
}
