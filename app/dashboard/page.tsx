"use client"

import { createClient } from "@/lib/supabase/client"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useEffect, useState } from "react"
import type { Book } from "@/lib/types"
import {
  Plus,
  BookOpen,
  Eye,
  Heart,
  PenTool,
  MoreVertical,
  Globe,
  FileText,
  Trash2,
  Settings,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

export default function DashboardPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBooks = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from("books")
      .select("*, profiles(*)")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })

    setBooks((data || []) as Book[])
    setLoading(false)
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  const handleDelete = async (bookId: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("books").delete().eq("id", bookId)
    if (error) {
      toast.error("Failed to delete book")
    } else {
      toast.success("Book deleted")
      setBooks(books.filter((b) => b.id !== bookId))
    }
  }

  const handlePublish = async (bookId: string, currentStatus: string) => {
    const supabase = createClient()
    const newStatus = currentStatus === "published" ? "draft" : "published"
    const { error } = await supabase
      .from("books")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", bookId)
    if (error) {
      toast.error("Failed to update status")
    } else {
      toast.success(
        newStatus === "published" ? "Book published!" : "Book unpublished"
      )
      fetchBooks()
    }
  }

  const statusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-emerald-500/15 text-emerald-400"
      case "draft":
        return "bg-secondary text-muted-foreground"
      case "archived":
        return "bg-red-500/15 text-red-400"
      default:
        return "bg-secondary text-muted-foreground"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              My Books
            </h1>
            <p className="mt-1 text-muted-foreground">
              Manage your stories and chapters
            </p>
          </div>
          <Link href="/write/new">
            <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              New Book
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="animate-pulse rounded-xl border border-border bg-card p-4"
              >
                <div className="flex gap-4">
                  <div className="h-24 w-16 rounded-lg bg-secondary" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 w-48 bg-secondary rounded" />
                    <div className="h-4 w-32 bg-secondary rounded" />
                    <div className="h-3 w-64 bg-secondary rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : books.length > 0 ? (
          <div className="space-y-3">
            {books.map((book) => (
              <div
                key={book.id}
                className="group flex items-start gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/20"
              >
                {/* Cover */}
                <Link
                  href={`/write/${book.id}`}
                  className="shrink-0 overflow-hidden rounded-lg"
                >
                  {book.cover_url ? (
                    <img
                      src={book.cover_url || "/placeholder.svg"}
                      alt={book.title}
                      className="h-24 w-16 object-cover"
                    />
                  ) : (
                    <div className="flex h-24 w-16 items-center justify-center bg-secondary">
                      <BookOpen className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/write/${book.id}`}>
                      <h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1">
                        {book.title}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge
                        className={`${statusColor(book.status)} border-0 text-[11px]`}
                      >
                        {book.status}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                            aria-label="Book options"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-card border-border"
                        >
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/write/${book.id}`}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <Settings className="h-4 w-4" />
                              Manage Chapters
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handlePublish(book.id, book.status)
                            }
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <Globe className="h-4 w-4" />
                            {book.status === "published"
                              ? "Unpublish"
                              : "Publish"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(book.id)}
                            className="flex items-center gap-2 cursor-pointer text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {book.genre}
                  </p>
                  {book.description && (
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                      {book.description}
                    </p>
                  )}

                  <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {book.chapter_count} chapters
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {book.view_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {book.like_count}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
              <PenTool className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              No books yet
            </h2>
            <p className="mt-2 max-w-sm text-muted-foreground">
              Start writing your first book. Create chapters, manage your
              content, and publish when you are ready.
            </p>
            <Link href="/write/new" className="mt-6">
              <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                Create Your First Book
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
