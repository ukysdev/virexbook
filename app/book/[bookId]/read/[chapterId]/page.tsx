"use client"

import { createClient } from "@/lib/supabase/client"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ShareButton } from "@/components/share-button"
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

  const fetchData = useCallback(async () => {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) setCurrentUserId(user.id)

    const [bookRes, chapterRes, allChaptersRes, commentsRes] =
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

    setLoading(false)
  }, [bookId, chapterId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

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
            <ShareButton
              title={`${chapter.title} - ${book.title}`}
              description={`Kapitel ${currentIndex + 1} von "${book.title}"`}
              url={typeof window !== "undefined" ? window.location.href : ""}
              variant="outline"
            />
          </div>
        </div>

        {/* Content */}
        <article className="prose-invert max-w-none">
          <div className="whitespace-pre-wrap text-foreground leading-relaxed text-base">
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
