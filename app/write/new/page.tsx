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
import { useRouter } from "next/navigation"
import { useState } from "react"
import { BookOpen, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { uploadAssetFile } from "@/lib/upload-asset"

export default function NewBookPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [genre, setGenre] = useState("Other")
  const [coverUrl, setCoverUrl] = useState("")
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState("")
  const [tags, setTags] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      toast.error("You must be logged in")
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

    const { data, error } = await supabase
      .from("books")
      .insert({
        user_id: user.id,
        title: title.trim(),
        description: description.trim() || null,
        genre,
        cover_url: uploadedCoverUrl,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      })
      .select()
      .single()

    if (error) {
      toast.error(error.message)
      setIsLoading(false)
      return
    }

    toast.success("Book created!")
    router.push(`/write/${data.id}`)
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-2xl px-4 py-8">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">
            Create New Book
          </h1>
          <p className="mt-1 text-muted-foreground">
            Set up your book details. You can add chapters after creating it.
          </p>
        </div>

        <form
          onSubmit={handleCreate}
          className="space-y-6 rounded-xl border border-border bg-card p-6"
        >
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-foreground">
              Title *
            </Label>
            <Input
              id="title"
              placeholder="Your book title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description" className="text-foreground">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="What is your story about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground resize-none"
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-foreground">Genre *</Label>
            <Select value={genre} onValueChange={setGenre}>
              <SelectTrigger className="bg-secondary border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {GENRES.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="cover" className="text-foreground">
              Cover Image
            </Label>
            <Input
              id="cover"
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            />
            {(coverPreview || coverUrl) && (
              <div className="mt-2 w-32 overflow-hidden rounded-lg border border-border">
                <img
                  src={coverPreview || coverUrl || "/placeholder.svg"}
                  alt="Cover preview"
                  className="aspect-[3/4] w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none"
                  }}
                />
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tags" className="text-foreground">
              Tags
            </Label>
            <Input
              id="tags"
              placeholder="romance, fantasy, adventure (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <Button
            type="submit"
            className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isLoading || !title.trim()}
          >
            <BookOpen className="h-4 w-4" />
            {isLoading ? "Creating..." : "Create Book"}
          </Button>
        </form>
      </div>
    </div>
  )
}
