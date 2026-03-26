"use client"

import React from "react"

import { createClient } from "@/lib/supabase/client"
import { uploadAssetFile } from "@/lib/upload-asset"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState, useCallback, useRef } from "react"
import type { Chapter } from "@/lib/types"
import { ArrowLeft, Save, Globe, Upload, CalendarClock, Headphones, Trash2 } from "lucide-react"
import { toast } from "sonner"

export default function ChapterEditorPage() {
  const params = useParams()
  const router = useRouter()
  const bookId = params.bookId as string
  const chapterId = params.chapterId as string
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [audioUrl, setAudioUrl] = useState("")
  const [audioUploading, setAudioUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [publishAt, setPublishAt] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchChapter = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from("chapters")
      .select("*")
      .eq("id", chapterId)
      .single()

    if (data) {
      const ch = data as Chapter
      setChapter(ch)
      setTitle(ch.title)
      setContent(ch.content)
      setAudioUrl(ch.audio_url || "")
      setPublishAt(
        ch.publish_at ? new Date(ch.publish_at).toISOString().slice(0, 16) : ""
      )
    }
    setLoading(false)
  }, [chapterId])

  useEffect(() => {
    fetchChapter()
  }, [fetchChapter])

  const saveChapter = useCallback(
    async (showToast = true) => {
      setSaving(true)
      const supabase = createClient()
      const wordCount = content.split(/\s+/).filter(Boolean).length

      const { error } = await supabase
        .from("chapters")
        .update({
          title: title.trim(),
          content,
          audio_url: audioUrl.trim() || null,
          publish_at: publishAt ? new Date(publishAt).toISOString() : null,
          word_count: wordCount,
          updated_at: new Date().toISOString(),
        })
        .eq("id", chapterId)

      setSaving(false)
      if (error) {
        if (showToast) toast.error("Failed to save")
      } else {
        setChapter((prev) =>
          prev
            ? {
                ...prev,
                title: title.trim(),
                content,
                audio_url: audioUrl.trim() || null,
                publish_at: publishAt ? new Date(publishAt).toISOString() : null,
                word_count: wordCount,
                updated_at: new Date().toISOString(),
              }
            : prev
        )
        setLastSaved(new Date())
        if (showToast) toast.success("Saved!")
      }
    },
    [audioUrl, content, title, chapterId, publishAt]
  )

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!chapter) return

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current)
    }

    autoSaveTimerRef.current = setTimeout(() => {
      if (
        content !== chapter.content ||
        title !== chapter.title ||
        audioUrl !== (chapter.audio_url || "")
      ) {
        saveChapter(false)
      }
    }, 30000)

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }
    }
  }, [audioUrl, content, title, chapter, saveChapter])

  // Keyboard shortcut Ctrl+S
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault()
        saveChapter()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [saveChapter])

  const handleTxtUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.name.endsWith(".txt")) {
      toast.error("Only .txt files are supported")
      return
    }
    const text = await file.text()
    setContent(text)
    toast.success("Text file content loaded into editor")
    e.target.value = ""
  }

  const publishChapter = async () => {
    const supabase = createClient()
    const newStatus =
      chapter?.status === "published" ? "draft" : "published"
    const { error } = await supabase
      .from("chapters")
      .update({
        status: newStatus,
        publish_at: newStatus === "published" ? null : publishAt ? new Date(publishAt).toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", chapterId)

    if (error) {
      toast.error("Failed to update status")
    } else {
      setChapter((prev) =>
        prev ? ({ ...prev, status: newStatus } as Chapter) : null
      )
      toast.success(
        newStatus === "published" ? "Chapter published!" : "Chapter unpublished"
      )
    }
  }

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("audio/")) {
      toast.error("Please upload an audio file")
      e.target.value = ""
      return
    }

    try {
      setAudioUploading(true)
      const uploadedAudioUrl = await uploadAssetFile(file, "chapter-audio")
      setAudioUrl(uploadedAudioUrl)
      toast.success("Audiobook file uploaded")
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Audio upload failed"
      toast.error(message)
    } finally {
      setAudioUploading(false)
      e.target.value = ""
    }
  }

  const wordCount = content.split(/\s+/).filter(Boolean).length

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-64 bg-secondary rounded" />
            <div className="h-96 bg-secondary rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!chapter) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-20">
          <h2 className="text-xl font-semibold text-foreground">
            Chapter not found
          </h2>
          <Link href={`/write/${bookId}`} className="mt-4">
            <Button className="bg-primary text-primary-foreground">
              Back to Book
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-4xl px-4 py-6">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between gap-4">
          <Link
            href={`/write/${bookId}`}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
            Chapters
          </Link>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {lastSaved && (
              <span>
                Saved{" "}
                {lastSaved.toLocaleTimeString("de-DE", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
            <span>{wordCount} words</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <input
                type="file"
                accept=".txt"
                onChange={handleTxtUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
                aria-label="Upload TXT file"
              />
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 border-border text-foreground hover:bg-secondary pointer-events-none bg-transparent"
              >
                <Upload className="h-3.5 w-3.5" />
                Import .txt
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={publishChapter}
              className="gap-1.5 border-border text-foreground hover:bg-secondary bg-transparent"
            >
              <Globe className="h-3.5 w-3.5" />
              {chapter.status === "published" ? "Unpublish" : "Publish"}
            </Button>
            <Button
              size="sm"
              onClick={() => saveChapter()}
              disabled={saving}
              className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Save className="h-3.5 w-3.5" />
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        <div className="mb-4 rounded-xl border border-border bg-card p-3">
          <label
            htmlFor="publishAt"
            className="mb-2 flex items-center gap-2 text-xs font-medium text-foreground"
          >
            <CalendarClock className="h-3.5 w-3.5" />
            Scheduled publish (optional)
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <Input
              id="publishAt"
              type="datetime-local"
              value={publishAt}
              onChange={(e) => setPublishAt(e.target.value)}
              className="max-w-xs bg-secondary border-border text-foreground"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPublishAt("")}
              className="bg-transparent"
            >
              Clear
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Save the chapter after setting date/time. Use `/api/cron/publish-scheduled` with a free cron service to auto-publish.
          </p>
        </div>

        <div className="mb-4 rounded-xl border border-border bg-card p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Headphones className="h-4 w-4" />
                Audiobook audio for this chapter
              </label>
              <p className="mt-1 text-xs text-muted-foreground">
                Readers can listen to this chapter when an audio file is attached.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  aria-label="Upload audiobook audio"
                />
                <Button
                  variant="outline"
                  size="sm"
                  disabled={audioUploading}
                  className="gap-1.5 border-border text-foreground hover:bg-secondary pointer-events-none bg-transparent"
                >
                  <Upload className="h-3.5 w-3.5" />
                  {audioUploading ? "Uploading..." : "Upload audio"}
                </Button>
              </div>
              {audioUrl && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setAudioUrl("")}
                  className="gap-1.5 bg-transparent"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </Button>
              )}
            </div>
          </div>

          {audioUrl ? (
            <div className="mt-4 space-y-2">
              <audio controls preload="none" className="w-full">
                <source src={audioUrl} />
                Your browser does not support audio playback.
              </audio>
              <p className="break-all text-xs text-muted-foreground">
                {audioUrl}
              </p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              No audiobook audio uploaded yet.
            </p>
          )}
        </div>

        {/* Title */}
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Chapter title"
          className="mb-4 border-0 bg-transparent px-0 text-2xl font-bold text-foreground placeholder:text-muted-foreground focus-visible:ring-0 font-display"
        />

        {/* Editor */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your chapter here..."
          className="min-h-[60vh] w-full resize-none rounded-xl border border-border bg-card p-6 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 leading-relaxed"
          aria-label="Chapter content"
        />
      </div>
    </div>
  )
}
