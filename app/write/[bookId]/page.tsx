"use client"

import React from "react"

import { createClient } from "@/lib/supabase/client"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import type { Book, Chapter } from "@/lib/types"
import {
  Plus,
  ArrowLeft,
  GripVertical,
  Eye,
  PenTool,
  Trash2,
  FileText,
  Globe,
  Upload,
  BookOpen,
} from "lucide-react"
import { toast } from "sonner"

export default function ChapterManagerPage() {
  const params = useParams()
  const router = useRouter()
  const bookId = params.bookId as string
  const [book, setBook] = useState<Book | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [newChapterTitle, setNewChapterTitle] = useState("")
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    await supabase
      .from("chapters")
      .update({
        status: "published",
        publish_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq("book_id", bookId)
      .eq("user_id", user.id)
      .eq("status", "draft")
      .lte("publish_at", new Date().toISOString())
      .not("publish_at", "is", null)

    const [bookRes, chaptersRes] = await Promise.all([
      supabase.from("books").select("*").eq("id", bookId).single(),
      supabase
        .from("chapters")
        .select("*")
        .eq("book_id", bookId)
        .order("order_index", { ascending: true }),
    ])

    if (bookRes.data) setBook(bookRes.data as Book)
    if (chaptersRes.data) setChapters(chaptersRes.data as Chapter[])
    setLoading(false)
  }, [bookId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const addChapter = async () => {
    if (!newChapterTitle.trim()) return

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const nextIndex = chapters.length
    const { data, error } = await supabase
      .from("chapters")
      .insert({
        book_id: bookId,
        user_id: user.id,
        title: newChapterTitle.trim(),
        order_index: nextIndex,
      })
      .select()
      .single()

    if (error) {
      toast.error(error.message)
      return
    }

    // Update chapter count
    await supabase
      .from("books")
      .update({
        chapter_count: nextIndex + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", bookId)

    setChapters([...chapters, data as Chapter])
    setNewChapterTitle("")
    toast.success("Chapter added!")
  }

  const deleteChapter = async (chapterId: string) => {
    const supabase = createClient()
    const { error } = await supabase
      .from("chapters")
      .delete()
      .eq("id", chapterId)

    if (error) {
      toast.error("Failed to delete")
      return
    }

    const updated = chapters.filter((c) => c.id !== chapterId)
    setChapters(updated)

    await supabase
      .from("books")
      .update({
        chapter_count: updated.length,
        updated_at: new Date().toISOString(),
      })
      .eq("id", bookId)

    toast.success("Chapter deleted")
  }

  const publishChapter = async (chapterId: string, currentStatus: string) => {
    const supabase = createClient()
    const newStatus = currentStatus === "published" ? "draft" : "published"
    const { error } = await supabase
      .from("chapters")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", chapterId)

    if (error) {
      toast.error("Failed to update")
      return
    }

    setChapters(
      chapters.map((c) => (c.id === chapterId ? { ...c, status: newStatus } : c)) as Chapter[]
    )
    toast.success(
      newStatus === "published" ? "Chapter published" : "Chapter unpublished"
    )
  }

  const handleTxtUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.name.endsWith(".txt")) {
      toast.error("Only .txt files are supported")
      return
    }

    const text = await file.text()
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const chapterTitle = file.name.replace(".txt", "")
    const wordCount = text.split(/\s+/).filter(Boolean).length
    const nextIndex = chapters.length

    const { data, error } = await supabase
      .from("chapters")
      .insert({
        book_id: bookId,
        user_id: user.id,
        title: chapterTitle,
        content: text,
        order_index: nextIndex,
        word_count: wordCount,
      })
      .select()
      .single()

    if (error) {
      toast.error(error.message)
      return
    }

    await supabase
      .from("books")
      .update({
        chapter_count: nextIndex + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", bookId)

    setChapters([...chapters, data as Chapter])
    toast.success(`Uploaded "${chapterTitle}" (${wordCount} words)`)
    e.target.value = ""
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-64 bg-secondary rounded" />
            <div className="h-4 w-96 bg-secondary rounded" />
            <div className="mt-8 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="h-16 bg-secondary rounded-xl"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h2 className="text-xl font-semibold text-foreground">
            Book not found
          </h2>
          <Link href="/dashboard" className="mt-4">
            <Button className="bg-primary text-primary-foreground">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-4xl px-4 py-8">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Book header */}
        <div className="mb-8 flex items-start gap-4">
          {book.cover_url ? (
            <img
              src={book.cover_url || "/placeholder.svg"}
              alt={book.title}
              className="h-20 w-14 rounded-lg object-cover shrink-0"
            />
          ) : (
            <div className="flex h-20 w-14 shrink-0 items-center justify-center rounded-lg bg-secondary">
              <BookOpen className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <h1 className="font-display text-2xl font-bold text-foreground">
                  {book.title}
                </h1>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {book.genre} - {chapters.length} chapters
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link href={`/write/${bookId}/edit`}>
                  <Button variant="outline" className="text-foreground hover:bg-secondary">
                    Edit details
                  </Button>
                </Link>
              </div>

            </div>

            <Badge
              className={`mt-2 border-0 text-[11px] ${
                book.status === "published"
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {book.status}
            </Badge>
          </div>
        </div>

        {/* Add chapter */}
        <div className="mb-6 flex gap-3">
          <Input
            placeholder="New chapter title..."
            value={newChapterTitle}
            onChange={(e) => setNewChapterTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addChapter()}
            className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
          />
          <Button
            onClick={addChapter}
            disabled={!newChapterTitle.trim()}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
          >
            <Plus className="h-4 w-4" />
            Add
          </Button>
          <div className="relative shrink-0">
            <input
              type="file"
              accept=".txt"
              onChange={handleTxtUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
              aria-label="Upload TXT file"
            />
            <Button
              variant="outline"
              className="gap-2 border-border text-foreground hover:bg-secondary pointer-events-none bg-transparent"
            >
              <Upload className="h-4 w-4" />
              Upload .txt
            </Button>
          </div>
        </div>

        {/* Chapter list */}
        {chapters.length > 0 ? (
          <div className="space-y-2">
            {chapters.map((chapter, index) => (
              <div
                key={chapter.id}
                className="group flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:border-primary/20"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-xs font-medium text-muted-foreground">
                  {index + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <Link
                    href={`/write/${bookId}/chapter/${chapter.id}`}
                    className="font-medium text-foreground hover:text-primary transition-colors text-sm line-clamp-1"
                  >
                    {chapter.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {chapter.word_count} words
                  </p>
                  {chapter.publish_at && chapter.status === "draft" && (
                    <p className="text-[11px] text-amber-500">
                      Scheduled: {new Date(chapter.publish_at).toLocaleString("de-DE")}
                    </p>
                  )}
                </div>

                <Badge
                  className={`shrink-0 border-0 text-[10px] ${
                    chapter.status === "published"
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {chapter.status}
                </Badge>

                <div className="flex items-center gap-1 shrink-0">
                  <Link href={`/write/${bookId}/chapter/${chapter.id}`}>
                    <button
                      type="button"
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                      aria-label="Edit chapter"
                    >
                      <PenTool className="h-3.5 w-3.5" />
                    </button>
                  </Link>
                  <button
                    type="button"
                    onClick={() => publishChapter(chapter.id, chapter.status)}
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                    aria-label={
                      chapter.status === "published"
                        ? "Unpublish chapter"
                        : "Publish chapter"
                    }
                  >
                    <Globe className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteChapter(chapter.id)}
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/20 hover:text-destructive transition-colors"
                    aria-label="Delete chapter"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center">
            <FileText className="mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No chapters yet. Add one above or upload a .txt file.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
