"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { BookCard } from "@/components/book-card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import type { Book, ReadingProgress } from "@/lib/types"
import { BookMarked, BookOpen } from "lucide-react"

export default function LibraryPage() {
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [savedBooks, setSavedBooks] = useState<Book[]>([])
  const [progressRows, setProgressRows] = useState<ReadingProgress[]>([])

  const progressMap = useMemo(() => {
    const map = new Map<string, ReadingProgress>()
    for (const row of progressRows) {
      map.set(row.book_id, row)
    }
    return map
  }, [progressRows])

  const fetchLibrary = useCallback(async () => {
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

    const [savedRes, progressRes] = await Promise.all([
      supabase
        .from("reading_lists")
        .select("book_id, books(*, profiles(*))")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("reading_progress")
        .select("id, user_id, book_id, chapter_id, scroll_position, updated_at")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false }),
    ])

    const books = (savedRes.data || [])
      .map((row) => row.books)
      .filter(Boolean) as Book[]

    setSavedBooks(books)
    setProgressRows((progressRes.data || []) as ReadingProgress[])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchLibrary()
  }, [fetchLibrary])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">
            My Library
          </h1>
          <p className="mt-1 text-muted-foreground">
            Saved stories and your continue-reading links
          </p>
        </div>

        {!isLoggedIn && !loading && (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <BookMarked className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
            <h2 className="text-xl font-semibold text-foreground">
              Log in to use your library
            </h2>
            <Link href="/auth/login" className="mt-4 inline-block">
              <Button className="bg-primary text-primary-foreground">Login</Button>
            </Link>
          </div>
        )}

        {isLoggedIn && !loading && savedBooks.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <BookOpen className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
            <h2 className="text-xl font-semibold text-foreground">
              No saved stories yet
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Add stories from a book page to build your library.
            </p>
            <Link href="/explore" className="mt-4 inline-block">
              <Button className="bg-primary text-primary-foreground">
                Explore stories
              </Button>
            </Link>
          </div>
        )}

        {isLoggedIn && !loading && savedBooks.length > 0 && (
          <>
            <section className="mb-8 space-y-2">
              {savedBooks.map((book) => {
                const progress = progressMap.get(book.id)
                if (!progress?.chapter_id) return null

                return (
                  <Link
                    key={`progress-${book.id}`}
                    href={`/book/${book.id}/read/${progress.chapter_id}`}
                    className="block rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/30 hover:bg-primary/5"
                  >
                    <p className="text-sm font-semibold text-foreground">
                      Continue: {book.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Scroll position: {Math.round((progress.scroll_position || 0) * 100)}%
                    </p>
                  </Link>
                )
              })}
            </section>

            <section>
              <h2 className="mb-4 font-display text-xl font-bold text-foreground">
                Saved Stories
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {savedBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}
