"use client"

import { createClient } from "@/lib/supabase/client"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ShareButton } from "@/components/share-button"
import TTSButton from "@/components/tts-button"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import type { Chapter, Comment, Book } from "@/lib/types"
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  MessageCircle,
  Send,
  ChevronUp,
  Quote,
  Type,
  Palette,
} from "lucide-react"
import { toast } from "sonner"

export default function ReaderPage() {
  const params = useParams()
  const bookId = params.bookId as string
  const chapterId = params.chapterId as string

  const [book, setBook] = useState<Book | null>(null)
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [showComments, setShowComments] = useState(false)
  const [fontSize, setFontSize] = useState(18)
  const [lineHeight, setLineHeight] = useState(1.75)
  const [readerTheme, setReaderTheme] = useState<"default" | "sepia" | "night">("default")
  const [selectedQuote, setSelectedQuote] = useState("")

  const getScrollProgress = useCallback(() => {
    const scrollTop = window.scrollY || 0
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    if (maxScroll <= 0) return 0
    return Math.max(0, Math.min(1, scrollTop / maxScroll))
  }, [])

  const saveProgress = useCallback(
    async (forcedScroll?: number) => {
      if (!currentUserId) return
      const supabase = createClient()
      const scrollValue = forcedScroll ?? getScrollProgress()
      await supabase.from("reading_progress").upsert(
        {
          user_id: currentUserId,
          book_id: bookId,
          chapter_id: chapterId,
          scroll_position: scrollValue,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,book_id" }
      )
    },
    [bookId, chapterId, currentUserId, getScrollProgress]
  )

  const fetchData = useCallback(async () => {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) setCurrentUserId(user.id)

    const [bookRes, chapterRes, allChaptersRes, commentsRes, progressRes] =
      await Promise.all([
        supabase.from("books").select("*").eq("id", bookId).single(),
        supabase.from("chapters").select("*").eq("id", chapterId).single(),
        supabase
          .from("chapters")
          .select("id, title, order_index")
          .eq("book_id", bookId)
          .eq("status", "published")
          .order("order_index", { ascending: true }),
        supabase
          .from("comments")
          .select("*, profiles(*)")
          .eq("chapter_id", chapterId)
          .order("created_at", { ascending: true }),
        user
          ? supabase
              .from("reading_progress")
              .select("chapter_id, scroll_position")
              .eq("user_id", user.id)
              .eq("book_id", bookId)
              .maybeSingle()
          : Promise.resolve({ data: null }),
      ])

    if (bookRes.data) setBook(bookRes.data as Book)
    if (chapterRes.data) setChapter(chapterRes.data as Chapter)
    if (allChaptersRes.data) setChapters(allChaptersRes.data as Chapter[])
    if (commentsRes.data) setComments(commentsRes.data as Comment[])

    // Increment chapter view count
    if (chapterRes.data) {
      await supabase
        .from("chapters")
        .update({ view_count: (chapterRes.data as Chapter).view_count + 1 })
        .eq("id", chapterId)
    }

    if (
      progressRes?.data?.chapter_id === chapterId &&
      typeof progressRes.data.scroll_position === "number"
    ) {
      const target = progressRes.data.scroll_position
      setTimeout(() => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight
        if (maxScroll > 0) {
          window.scrollTo({
            top: maxScroll * Math.max(0, Math.min(1, target)),
            behavior: "smooth",
          })
        }
      }, 120)
    }

    setLoading(false)
  }, [bookId, chapterId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (typeof window === "undefined") return
    const savedFont = window.localStorage.getItem("reader_font_size")
    const savedLine = window.localStorage.getItem("reader_line_height")
    const savedTheme = window.localStorage.getItem("reader_theme")
    if (savedFont) setFontSize(Number(savedFont))
    if (savedLine) setLineHeight(Number(savedLine))
    if (savedTheme === "default" || savedTheme === "sepia" || savedTheme === "night") {
      setReaderTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    window.localStorage.setItem("reader_font_size", String(fontSize))
    window.localStorage.setItem("reader_line_height", String(lineHeight))
    window.localStorage.setItem("reader_theme", readerTheme)
  }, [fontSize, lineHeight, readerTheme])

  useEffect(() => {
    if (!currentUserId) return
    const onScroll = () => {
      if (scrollTimer) window.clearTimeout(scrollTimer)
      scrollTimer = window.setTimeout(() => {
        void saveProgress()
      }, 300)
    }

    let scrollTimer: number | undefined
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      if (scrollTimer) window.clearTimeout(scrollTimer)
      void saveProgress()
      window.removeEventListener("scroll", onScroll)
    }
  }, [currentUserId, saveProgress])

  useEffect(() => {
    const onSelectionChange = () => {
      const selected = window.getSelection()?.toString().trim() || ""
      setSelectedQuote(selected.slice(0, 300))
    }
    document.addEventListener("selectionchange", onSelectionChange)
    return () => document.removeEventListener("selectionchange", onSelectionChange)
  }, [])

  const currentIndex = chapters.findIndex((c) => c.id === chapterId)
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null
  const nextChapter =
    currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null

  const addComment = async () => {
    if (!newComment.trim() || !currentUserId) {
      if (!currentUserId) toast.error("Log in to comment")
      return
    }

    const supabase = createClient()
    const { data, error } = await supabase
      .from("comments")
      .insert({
        user_id: currentUserId,
        chapter_id: chapterId,
        content: newComment.trim(),
      })
      .select("*, profiles(*)")
      .single()

    if (error) {
      toast.error("Failed to post comment")
      return
    }

    setComments([...comments, data as Comment])
    setNewComment("")
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const shareQuote = async () => {
    if (!selectedQuote || !book || !chapter) return
    const baseUrl = typeof window !== "undefined" ? window.location.href : ""
    const text = `"${selectedQuote}" — ${chapter.title}, ${book.title}`
    if (navigator.share) {
      try {
        await navigator.share({ title: book.title, text, url: baseUrl })
        return
      } catch {
        // Fallback to clipboard
      }
    }
    await navigator.clipboard.writeText(`${text}\n${baseUrl}`)
    toast.success("Quote copied to clipboard")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-3xl px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-64 bg-secondary rounded" />
            <div className="h-4 w-32 bg-secondary rounded" />
            <div className="mt-8 space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={`skeleton-${i}`} className="h-4 bg-secondary rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!chapter || !book) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-20">
          <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="text-xl font-semibold text-foreground">
            Chapter not found
          </h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/book/${bookId}`}
            className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {book.title}
          </Link>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
                {chapter.title}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Chapter {currentIndex + 1} of {chapters.length} -{" "}
                {chapter.word_count} words
              </p>
            </div>
            <div className="flex items-center gap-3">
              <TTSButton text={chapter.content || ""} />
              <ShareButton
                title={`${chapter.title} - ${book.title}`}
                description={`Chapter ${currentIndex + 1} of "${book.title}"`}
                url={typeof window !== "undefined" ? window.location.href : ""}
                variant="outline"
              />
            </div>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-3">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Type className="h-3.5 w-3.5" />
            Reader style
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setFontSize((prev) => Math.max(15, prev - 1))}
            className="h-8 bg-transparent"
          >
            A-
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setFontSize((prev) => Math.min(24, prev + 1))}
            className="h-8 bg-transparent"
          >
            A+
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setLineHeight((prev) => (prev < 1.8 ? 2 : 1.6))}
            className="h-8 bg-transparent"
          >
            Line spacing
          </Button>
          <span className="mx-1 h-5 w-px bg-border" />
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Palette className="h-3.5 w-3.5" />
            Theme
          </span>
          {(["default", "sepia", "night"] as const).map((theme) => (
            <Button
              key={theme}
              size="sm"
              variant={readerTheme === theme ? "default" : "outline"}
              onClick={() => setReaderTheme(theme)}
              className="h-8 capitalize"
            >
              {theme}
            </Button>
          ))}
          {selectedQuote && (
            <Button size="sm" onClick={shareQuote} className="ml-auto gap-1.5 h-8">
              <Quote className="h-3.5 w-3.5" />
              Share quote
            </Button>
          )}
        </div>

        {/* Content */}
        <article className="max-w-none">
          <div
            className={`whitespace-pre-wrap rounded-xl border border-border p-5 ${
              readerTheme === "sepia"
                ? "bg-amber-50 text-amber-900 border-amber-100"
                : readerTheme === "night"
                  ? "bg-slate-950 text-slate-100 border-slate-800"
                  : "bg-card text-foreground"
            }`}
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: lineHeight,
            }}
          >
            {chapter.content || (
              <p className="italic text-muted-foreground">
                This chapter has no content yet.
              </p>
            )}
          </div>
        </article>

        {/* Navigation */}
        <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
          {prevChapter ? (
            <Link href={`/book/${bookId}/read/${prevChapter.id}`}>
              <Button
                variant="outline"
                className="gap-2 border-border text-foreground hover:bg-secondary bg-transparent"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>
            </Link>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={scrollToTop}
            className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            aria-label="Scroll to top"
          >
            <ChevronUp className="h-5 w-5" />
          </button>

          {nextChapter ? (
            <Link href={`/book/${bookId}/read/${nextChapter.id}`}>
              <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Link href={`/book/${bookId}`}>
              <Button
                variant="outline"
                className="gap-2 border-border text-foreground hover:bg-secondary bg-transparent"
              >
                Back to Book
              </Button>
            </Link>
          )}
        </div>

        {/* Comments section */}
        <div className="mt-10 border-t border-border pt-6">
          <button
            type="button"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            Comments ({comments.length})
          </button>

          {showComments && (
            <div className="mt-4 space-y-4">
              {/* Add comment */}
              {currentUserId && (
                <div className="flex gap-3">
                  <Textarea
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={2}
                    className="bg-secondary border-border text-foreground placeholder:text-muted-foreground resize-none"
                  />
                  <Button
                    onClick={addComment}
                    disabled={!newComment.trim()}
                    size="sm"
                    className="shrink-0 self-end bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Post comment</span>
                  </Button>
                </div>
              )}

              {/* Comment list */}
              {comments.length > 0 ? (
                <div className="space-y-3">
                  {comments.map((comment) => {
                    const profile = comment.profiles
                    return (
                      <div
                        key={comment.id}
                        className="rounded-xl border border-border bg-card p-3"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={profile?.avatar_url || ""}
                            />
                            <AvatarFallback className="bg-secondary text-secondary-foreground text-[10px]">
                              {profile?.display_name?.[0]?.toUpperCase() ||
                                profile?.username?.[0]?.toUpperCase() ||
                                "U"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium text-foreground">
                            {profile?.display_name || profile?.username}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {new Date(
                              comment.created_at
                            ).toLocaleDateString("de-DE")}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {comment.content}
                        </p>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No comments yet. Be the first!
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
