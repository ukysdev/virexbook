"use client"

import { useEffect, useState } from "react"
import { Search, BookOpen, SlidersHorizontal, X, Headphones } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Navbar } from "@/components/navbar"
import { BookCard } from "@/components/book-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GENRES, type Book } from "@/lib/types"
import { extractAudiobookBookIds, markBooksAsAudiobooks } from "@/lib/audiobooks"

export type ExploreFilter =
  | "all"
  | "originals"
  | "featured"
  | "staff_picks"
  | "popular"
  | "audiobooks"

interface DiscoverBooksPageProps {
  title: string
  description: string
  initialFilter?: ExploreFilter
  forcedFilter?: ExploreFilter
}

const FILTER_OPTIONS: Array<{ value: ExploreFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "audiobooks", label: "Audiobooks" },
  { value: "originals", label: "Originals" },
  { value: "featured", label: "Featured" },
  { value: "staff_picks", label: "Staff Picks" },
  { value: "popular", label: "Popular" },
]

function isExploreFilter(value: string | null): value is ExploreFilter {
  return FILTER_OPTIONS.some((option) => option.value === value)
}

export function DiscoverBooksPage({
  title,
  description,
  initialFilter = "all",
  forcedFilter,
}: DiscoverBooksPageProps) {
  const [books, setBooks] = useState<Book[]>([])
  const [search, setSearch] = useState("")
  const [genre, setGenre] = useState<string>("All")
  const [filter, setFilter] = useState<ExploreFilter>(initialFilter)
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    if (forcedFilter) {
      setFilter(forcedFilter)
      return
    }

    setFilter(initialFilter)
  }, [forcedFilter, initialFilter])

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true)
      const supabase = createClient()
      const activeFilter = forcedFilter ?? filter

      let audiobookBookIds: string[] = []

      if (activeFilter === "audiobooks") {
        const { data: audiobookChapters } = await supabase
          .from("chapters")
          .select("book_id")
          .eq("status", "published")
          .not("audio_url", "is", null)
          .limit(5000)

        audiobookBookIds = extractAudiobookBookIds(audiobookChapters)

        if (audiobookBookIds.length === 0) {
          setBooks([])
          setLoading(false)
          return
        }
      }

      let query = supabase
        .from("books")
        .select("*, profiles(*)")
        .eq("status", "published")
        .limit(120)

      if (genre !== "All") {
        query = query.eq("genre", genre)
      }

      if (activeFilter === "originals") {
        query = query.eq("is_original", true)
      } else if (activeFilter === "featured") {
        query = query.eq("is_featured", true)
      } else if (activeFilter === "staff_picks") {
        query = query.eq("is_staff_pick", true)
      } else if (activeFilter === "audiobooks") {
        query = query.in("id", audiobookBookIds)
      }

      query =
        activeFilter === "popular"
          ? query.order("view_count", { ascending: false })
          : query.order("created_at", { ascending: false })

      const { data } = await query
      const allBooks = (data || []) as Book[]
      const normalizedSearch = search.trim().toLowerCase()
      const booksWithAudio =
        activeFilter === "audiobooks"
          ? markBooksAsAudiobooks(allBooks, audiobookBookIds)
          : allBooks

      const filteredBooks = normalizedSearch
        ? booksWithAudio.filter((book) => {
            const titleMatch = book.title.toLowerCase().includes(normalizedSearch)
            const tagMatch = (book.tags || []).some((tag) =>
              tag.toLowerCase().includes(normalizedSearch)
            )
            const authorMatch =
              book.profiles?.username?.toLowerCase().includes(normalizedSearch) ||
              book.profiles?.display_name?.toLowerCase().includes(normalizedSearch)
            return Boolean(titleMatch || tagMatch || authorMatch)
          })
        : booksWithAudio

      setBooks(filteredBooks)
      setLoading(false)
    }

    const timer = setTimeout(fetchBooks, 300)
    return () => clearTimeout(timer)
  }, [search, genre, filter, forcedFilter])

  const activeFilter = forcedFilter ?? filter
  const itemLabel = activeFilter === "audiobooks" ? "audiobooks" : "stories"
  const emptyTitle =
    activeFilter === "audiobooks" ? "No audiobooks found" : "No stories found"

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {activeFilter === "audiobooks" && (
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                <Headphones className="h-3.5 w-3.5" />
                Audiobook Collection
              </span>
            )}
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            {title}
          </h1>
          <p className="mt-1 text-muted-foreground">{description}</p>
        </div>

        <div className="mb-6 flex flex-col gap-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={`Search ${itemLabel}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-border bg-secondary pl-10 text-foreground placeholder:text-muted-foreground"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button
              variant="outline"
              className="gap-2 border-border bg-transparent text-foreground hover:bg-secondary md:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </div>

          <div className={`flex flex-wrap gap-2 ${showFilters ? "block" : "hidden md:flex"}`}>
            {!forcedFilter && (
              <>
                <div className="flex flex-wrap gap-2">
                  {FILTER_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFilter(option.value)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                        filter === option.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                <div className="hidden h-6 w-px bg-border md:block" />
              </>
            )}

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setGenre("All")}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  genre === "All"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                All Genres
              </button>
              {GENRES.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setGenre(value)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    genre === value
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="animate-pulse rounded-xl border border-border bg-card"
              >
                <div className="aspect-[3/4] rounded-t-xl bg-secondary" />
                <div className="space-y-2 p-3">
                  <div className="h-4 rounded bg-secondary" />
                  <div className="h-3 w-2/3 rounded bg-secondary" />
                </div>
              </div>
            ))}
          </div>
        ) : books.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
              {activeFilter === "audiobooks" ? (
                <Headphones className="h-8 w-8 text-muted-foreground" />
              ) : (
                <BookOpen className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <h2 className="text-xl font-semibold text-foreground">{emptyTitle}</h2>
            <p className="mt-2 max-w-sm text-muted-foreground">
              {search
                ? `No ${itemLabel} match "${search}". Try a different search.`
                : `No ${itemLabel} found with the selected filters.`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
