"use client"

import { createClient } from "@/lib/supabase/client"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { VirexBadge } from "@/components/virex-badge"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import type { Book, Chapter, Profile } from "@/lib/types"
import {
  ArrowLeft,
  BookOpen,
  Eye,
  Heart,
  FileText,
  ShieldCheck,
  Calendar,
  Globe,
  Clock,
  ChevronRight,
} from "lucide-react"
import { toast } from "sonner"

export default function BookDetailPage() {
  const params = useParams()
  const bookId = params.bookId as string
  const [book, setBook] = useState<Book | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [author, setAuthor] = useState<Profile | null>(null)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) setCurrentUserId(user.id)

    const { data: bookData } = await supabase
      .from("books")
      .select("*, profiles(*)")
      .eq("id", bookId)
      .single()

    if (bookData) {
      const b = bookData as Book
      setBook(b)
      setLikeCount(b.like_count)
      if (b.profiles) setAuthor(b.profiles)

      // Increment view count
      await supabase
        .from("books")
        .update({ view_count: b.view_count + 1 })
        .eq("id", bookId)
    }

    const { data: chapterData } = await supabase
      .from("chapters")
      .select("*")
      .eq("book_id", bookId)
      .eq("status", "published")
      .order("order_index", { ascending: true })

    if (chapterData) setChapters(chapterData as Chapter[])

    // Check if liked
    if (user) {
      const { data: likeData } = await supabase
        .from("likes")
        .select("id")
        .eq("user_id", user.id)
        .eq("book_id", bookId)
        .single()

      if (likeData) setLiked(true)
    }

    setLoading(false)
  }, [bookId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const toggleLike = async () => {
    if (!currentUserId) {
      toast.error("Log in to like books")
      return
    }

    const supabase = createClient()

    if (liked) {
      await supabase
        .from("likes")
        .delete()
        .eq("user_id", currentUserId)
        .eq("book_id", bookId)

      setLiked(false)
      setLikeCount((prev) => Math.max(0, prev - 1))

      await supabase
        .from("books")
        .update({ like_count: Math.max(0, likeCount - 1) })
        .eq("id", bookId)
    } else {
      await supabase
        .from("likes")
        .insert({ user_id: currentUserId, book_id: bookId })

      setLiked(true)
      setLikeCount((prev) => prev + 1)

      await supabase
        .from("books")
        .update({ like_count: likeCount + 1 })
        .eq("id", bookId)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="animate-pulse">
            <div className="flex gap-6">
              <div className="h-72 w-48 rounded-xl bg-secondary shrink-0" />
              <div className="flex-1 space-y-4">
                <div className="h-8 w-3/4 bg-secondary rounded" />
                <div className="h-4 w-1/2 bg-secondary rounded" />
                <div className="h-20 bg-secondary rounded" />
              </div>
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
        <div className="flex flex-col items-center justify-center py-20">
          <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="text-xl font-semibold text-foreground">
            Book not found
          </h2>
          <Link href="/explore" className="mt-4">
            <Button className="bg-primary text-primary-foreground">
              Browse Books
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
          href="/explore"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Explore
        </Link>

        {/* Book info header */}
        <div className="flex flex-col gap-6 md:flex-row">
          {/* Cover */}
          <div className="shrink-0">
            {book.cover_url ? (
              <img
                src={book.cover_url || "/placeholder.svg"}
                alt={`Cover of ${book.title}`}
                className="h-72 w-48 rounded-xl object-cover shadow-lg mx-auto md:mx-0"
              />
            ) : (
              <div className="flex h-72 w-48 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-secondary shadow-lg mx-auto md:mx-0">
                <BookOpen className="h-16 w-16 text-primary/40" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-3">
              {book.is_original && <VirexBadge type="original" size="sm" />}
              {book.is_staff_pick && <VirexBadge type="staff_pick" size="sm" />}
              {book.is_featured && <VirexBadge type="featured" size="sm" />}
            </div>

            <h1 className="font-display text-3xl font-bold text-foreground text-balance">
              {book.title}
            </h1>

            {/* Author - Enhanced */}
            {author && (
              <div className="mt-4">
                <Link
                  href={`/profile/${author.username}`}
                  className="flex items-center gap-3 group"
                >
                  <Avatar className="h-12 w-12 border-2 border-border group-hover:border-primary/50 transition-colors">
                    <AvatarImage src={author.avatar_url || ""} />
                    <AvatarFallback className="bg-secondary text-secondary-foreground text-sm font-semibold">
                      {author.display_name?.[0]?.toUpperCase() ||
                        author.username[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                        {author.display_name || author.username}
                      </span>
                      {author.is_verified && (
                        <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Mehr von {author.display_name || author.username} lesen →
                    </span>
                  </div>
                </Link>
              </div>
            )}

            {/* Stats */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" />
                {(book.view_count + 1) < 50 ? "Neu veröffentlicht" : `${(book.view_count + 1).toLocaleString()} views`}
              </span>
              <span className="flex items-center gap-1.5">
                <Heart className="h-4 w-4" />
                {`${likeCount.toLocaleString()} likes`}
              </span>
              <span className="flex items-center gap-1.5">
                <FileText className="h-4 w-4" />
                {chapters.length} chapters
              </span>
              <span className="flex items-center gap-1.5">
                <Globe className="h-4 w-4" />
                {book.genre}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {new Date(book.created_at).toLocaleDateString("de-DE")}
              </span>
            </div>

            {/* Tags */}
            {book.tags && book.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {book.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            {book.description && (
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                {book.description}
              </p>
            )}

            {/* Actions */}
            <div className="mt-6 flex items-center gap-3">
              {chapters.length > 0 && (
                <Link href={`/book/${bookId}/read/${chapters[0].id}`}>
                  <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                    <BookOpen className="h-4 w-4" />
                    Start Reading
                  </Button>
                </Link>
              )}
              <Button
                variant="outline"
                onClick={toggleLike}
                className={`gap-2 border-border ${
                  liked
                    ? "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
                    : "text-foreground hover:bg-secondary"
                }`}
              >
                <Heart
                  className={`h-4 w-4 ${liked ? "fill-current" : ""}`}
                />
                {liked ? "Liked" : "Like"}
              </Button>
            </div>
          </div>
        </div>

        {/* Chapter list */}
        <div className="mt-10">
          <h2 className="font-display text-xl font-bold text-foreground mb-4">
            Chapters ({chapters.length})
          </h2>

          {chapters.length > 0 ? (
            <div className="space-y-3">
              {chapters.map((chapter, index) => {
                const readingTime = Math.max(1, Math.ceil(chapter.word_count / 200));
                return (
                  <Link
                    key={chapter.id}
                    href={`/book/${bookId}/read/${chapter.id}`}
                    className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm cursor-pointer"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-sm font-semibold text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        📖 {chapter.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          &lt; {readingTime} Min
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {chapter.word_count.toLocaleString()} words
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center">
              <FileText className="mb-3 h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No chapters published yet
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
