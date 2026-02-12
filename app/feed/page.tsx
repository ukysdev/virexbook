"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { BookCard } from "@/components/book-card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import type { Book, Chapter } from "@/lib/types"
import { BellRing, BookOpen, Rss } from "lucide-react"

type FeedChapter = Chapter & {
  books?: {
    id: string
    title: string
  }
}

export default function FeedPage() {
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [books, setBooks] = useState<Book[]>([])
  const [chapters, setChapters] = useState<FeedChapter[]>([])

  const fetchFeed = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setIsLoggedIn(false)
      setLoading(false)
      return
    }

    setIsLoggedIn(true)

    const { data: followRows } = await supabase
      .from("follows")
      .select("following_id")
      .eq("follower_id", user.id)

    const followingIds = (followRows || []).map((row) => row.following_id)
    if (followingIds.length === 0) {
      setBooks([])
      setChapters([])
      setLoading(false)
      return
    }

    const [bookRes, chapterRes] = await Promise.all([
      supabase
        .from("books")
        .select("*, profiles(*)")
        .eq("status", "published")
        .in("user_id", followingIds)
        .order("updated_at", { ascending: false })
        .limit(24),
      supabase
        .from("chapters")
        .select("id, title, order_index, updated_at, book_id, books(id, title)")
        .eq("status", "published")
        .in("user_id", followingIds)
        .order("updated_at", { ascending: false })
        .limit(15),
    ])

    setBooks((bookRes.data || []) as Book[])
    setChapters((chapterRes.data || []) as FeedChapter[])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchFeed()
  }, [fetchFeed])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">
            Your Feed
          </h1>
          <p className="mt-1 text-muted-foreground">
            New stories and chapters from authors you follow
          </p>
        </div>

        {!isLoggedIn && !loading && (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <BellRing className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
            <h2 className="text-xl font-semibold text-foreground">
              Log in to see your feed
            </h2>
            <div className="mt-4 flex items-center justify-center gap-2">
              <Link href="/auth/login">
                <Button className="bg-primary text-primary-foreground">
                  Login
                </Button>
              </Link>
              <Link href="/explore">
                <Button variant="outline" className="bg-transparent">
                  Explore stories
                </Button>
              </Link>
            </div>
          </div>
        )}

        {isLoggedIn && !loading && books.length === 0 && chapters.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <Rss className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
            <h2 className="text-xl font-semibold text-foreground">
              Your feed is empty
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Follow a few authors to get chapter updates here.
            </p>
            <Link href="/explore" className="mt-4 inline-block">
              <Button className="bg-primary text-primary-foreground">
                Discover authors
              </Button>
            </Link>
          </div>
        )}

        {isLoggedIn && !loading && chapters.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-bold text-foreground">
              <BookOpen className="h-5 w-5 text-primary" />
              Fresh Chapters
            </h2>
            <div className="space-y-2">
              {chapters.map((chapter) => (
                <Link
                  key={chapter.id}
                  href={`/book/${chapter.book_id}/read/${chapter.id}`}
                  className="block rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/30 hover:bg-primary/5"
                >
                  <p className="text-sm font-semibold text-foreground">
                    {chapter.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {chapter.books?.title || "Story"} • Chapter{" "}
                    {(chapter.order_index || 0) + 1}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {isLoggedIn && !loading && books.length > 0 && (
          <section>
            <h2 className="mb-4 font-display text-xl font-bold text-foreground">
              Updated Stories
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
