import React from "react"
import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { BookCard } from "@/components/book-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  BookOpen,
  TrendingUp,
  Star,
  ShieldCheck,
  ArrowRight,
  PenTool,
} from "lucide-react"
import type { Book } from "@/lib/types"

async function getFeaturedBooks() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("books")
    .select("*, profiles(*)")
    .eq("status", "published")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(6)
  return (data || []) as Book[]
}

async function getOriginalBooks() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("books")
    .select("*, profiles(*)")
    .eq("status", "published")
    .eq("is_original", true)
    .order("like_count", { ascending: false })
    .limit(6)
  return (data || []) as Book[]
}

async function getTrendingBooks() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("books")
    .select("*, profiles(*)")
    .eq("status", "published")
    .order("view_count", { ascending: false })
    .limit(12)
  return (data || []) as Book[]
}

async function getStaffPicks() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("books")
    .select("*, profiles(*)")
    .eq("status", "published")
    .eq("is_staff_pick", true)
    .order("created_at", { ascending: false })
    .limit(6)
  return (data || []) as Book[]
}

async function getContinueReading() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data } = await supabase
    .from("reading_progress")
    .select("chapter_id, book_id, books(title), chapters(title)")
    .eq("user_id", user.id)
    .not("chapter_id", "is", null)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  return data
}

export default async function HomePage() {
  const [featured, originals, trending, staffPicks, continueReading] = await Promise.all([
    getFeaturedBooks(),
    getOriginalBooks(),
    getTrendingBooks(),
    getStaffPicks(),
    getContinueReading(),
  ])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
              <ShieldCheck className="h-4 w-4" />
              VirexBooks Platform
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl text-balance">
              Write Your Story. Share It With the World.
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Discover thousands of stories from talented authors or start
              writing your own. VirexBooks is your home for creative writing.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/explore">
                <Button
                  size="lg"
                  className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <BookOpen className="h-5 w-5" />
                  Start Reading
                </Button>
              </Link>
              <Link href="/write">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 border-border text-foreground hover:bg-secondary bg-transparent"
                >
                  <PenTool className="h-5 w-5" />
                  Start Writing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10">
        {continueReading?.book_id && continueReading?.chapter_id && (
          <section className="mb-10 rounded-xl border border-border bg-card p-5">
            <h2 className="font-display text-lg font-bold text-foreground">
              Continue Reading
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {continueReading.books?.title} • {continueReading.chapters?.title}
            </p>
            <Link
              href={`/book/${continueReading.book_id}/read/${continueReading.chapter_id}`}
              className="mt-4 inline-block"
            >
              <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <BookOpen className="h-4 w-4" />
                Resume story
              </Button>
            </Link>
          </section>
        )}

        {/* VirexBooks Originals */}
        {originals.length > 0 && (
          <BookSection
            title="VirexBooks Originals"
            icon={<ShieldCheck className="h-5 w-5 text-primary" />}
            books={originals}
            href="/explore?filter=originals"
          />
        )}

        {/* Featured */}
        {featured.length > 0 && (
          <BookSection
            title="Featured Stories"
            icon={<Star className="h-5 w-5 text-amber-500" />}
            books={featured}
            href="/explore?filter=featured"
          />
        )}

        {/* Staff Picks */}
        {staffPicks.length > 0 && (
          <BookSection
            title="Staff Picks"
            icon={<Star className="h-5 w-5 text-amber-500" />}
            books={staffPicks}
            href="/explore?filter=staff_picks"
          />
        )}

        {/* Trending */}
        {trending.length > 0 && (
          <BookSection
            title="Trending Now"
            icon={<TrendingUp className="h-5 w-5 text-emerald-500" />}
            books={trending}
            href="/explore"
          />
        )}

        {/* Empty state */}
        {trending.length === 0 &&
          originals.length === 0 &&
          featured.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
                <BookOpen className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                No stories yet
              </h2>
              <p className="mt-2 max-w-sm text-muted-foreground">
                Be the first to publish a story on VirexBooks. Start writing
                now and share your creativity with the world.
              </p>
              <Link href="/write" className="mt-6">
                <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                  <PenTool className="h-4 w-4" />
                  Write Your First Story
                </Button>
              </Link>
            </div>
          )}
      </div>
    </div>
  )
}

function BookSection({
  title,
  icon,
  books,
  href,
}: {
  title: string
  icon: React.ReactNode
  books: Book[]
  href: string
}) {
  return (
    <section className="mb-12">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="font-display text-xl font-bold text-foreground">
            {title}
          </h2>
        </div>
        <Link
          href={href}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  )
}
