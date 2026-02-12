"use client"

import { createClient } from "@/lib/supabase/client"
import { Navbar } from "@/components/navbar"
import { BookCard } from "@/components/book-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GENRES, type Book } from "@/lib/types"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Search, BookOpen, SlidersHorizontal, X } from "lucide-react"

export default function ExplorePage() {
  const searchParams = useSearchParams()
  const [books, setBooks] = useState<Book[]>([])
  const [search, setSearch] = useState("")
  const [genre, setGenre] = useState<string>("All")
  const [filter, setFilter] = useState<string>(
    searchParams.get("filter") || "all"
  )
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true)
      const supabase = createClient()
      let query = supabase
        .from("books")
        .select("*, profiles(*)")
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(120)

      if (genre !== "All") {
        query = query.eq("genre", genre)
      }

      if (filter === "originals") {
        query = query.eq("is_original", true)
      } else if (filter === "featured") {
        query = query.eq("is_featured", true)
      } else if (filter === "staff_picks") {
        query = query.eq("is_staff_pick", true)
      } else if (filter === "popular") {
        query = query.order("view_count", { ascending: false })
      }

      const { data } = await query
      const allBooks = (data || []) as Book[]
      const normalizedSearch = search.trim().toLowerCase()

      const filteredBooks = normalizedSearch
        ? allBooks.filter((book) => {
            const titleMatch = book.title.toLowerCase().includes(normalizedSearch)
            const tagMatch = (book.tags || []).some((tag) =>
              tag.toLowerCase().includes(normalizedSearch)
            )
            const authorMatch =
              book.profiles?.username?.toLowerCase().includes(normalizedSearch) ||
              book.profiles?.display_name?.toLowerCase().includes(normalizedSearch)
            return Boolean(titleMatch || tagMatch || authorMatch)
          })
        : allBooks

      setBooks(filteredBooks)
      setLoading(false)
    }

    const timer = setTimeout(fetchBooks, 300)
    return () => clearTimeout(timer)
  }, [search, genre, filter])

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "originals", label: "Originals" },
    { value: "featured", label: "Featured" },
    { value: "staff_picks", label: "Staff Picks" },
    { value: "popular", label: "Popular" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">
            Explore Stories
          </h1>
          <p className="mt-1 text-muted-foreground">
            Discover new stories from talented authors
          </p>
        </div>

        {/* Search and filters */}
        <div className="mb-6 flex flex-col gap-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search books..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-secondary border-border text-foreground pl-10 placeholder:text-muted-foreground"
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
              className="gap-2 border-border text-foreground hover:bg-secondary md:hidden bg-transparent"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Filter chips */}
          <div className={`flex flex-wrap gap-2 ${showFilters ? "block" : "hidden md:flex"}`}>
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFilter(opt.value)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    filter === opt.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="h-6 w-px bg-border hidden md:block" />

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
              {GENRES.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGenre(g)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    genre === g
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="animate-pulse rounded-xl border border-border bg-card"
              >
                <div className="aspect-[3/4] bg-secondary rounded-t-xl" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-secondary rounded" />
                  <div className="h-3 w-2/3 bg-secondary rounded" />
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
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              No stories found
            </h2>
            <p className="mt-2 max-w-sm text-muted-foreground">
              {search
                ? `No stories match "${search}". Try a different search.`
                : "No stories found with the selected filters."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
