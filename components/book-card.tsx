import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, Heart, BookOpen, ShieldCheck, Star } from "lucide-react"
import type { Book } from "@/lib/types"

interface BookCardProps {
  book: Book
}

export function BookCard({ book }: BookCardProps) {
  const author = book.profiles

  return (
    <Link
      href={`/book/${book.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
    >
      {/* Cover */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-secondary">
        {book.cover_url ? (
          <img
            src={book.cover_url || "/placeholder.svg"}
            alt={`Cover of ${book.title}`}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-secondary">
            <BookOpen className="h-12 w-12 text-primary/40" />
          </div>
        )}

        {/* Badges overlay */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {book.is_original && (
            <Badge className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 gap-1">
              <ShieldCheck className="h-3 w-3" />
              Original
            </Badge>
          )}
          {book.is_staff_pick && (
            <Badge className="bg-amber-500 text-[10px] px-1.5 py-0.5 gap-1 text-background">
              <Star className="h-3 w-3" />
              Staff Pick
            </Badge>
          )}
          {book.is_featured && (
            <Badge className="bg-emerald-500 text-[10px] px-1.5 py-0.5 text-background">
              Featured
            </Badge>
          )}
        </div>

        {/* Genre chip */}
        <div className="absolute bottom-2 right-2">
          <Badge
            variant="secondary"
            className="bg-card/90 backdrop-blur text-[10px] text-foreground border-0"
          >
            {book.genre}
          </Badge>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        <h3 className="line-clamp-1 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
          {book.title}
        </h3>

        {author && (
          <div className="flex items-center gap-1.5">
            <Avatar className="h-4 w-4">
              <AvatarImage src={author.avatar_url || ""} />
              <AvatarFallback className="bg-secondary text-secondary-foreground text-[8px]">
                {author.display_name?.[0]?.toUpperCase() ||
                  author.username[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground line-clamp-1">
              {author.display_name || author.username}
            </span>
            {author.is_verified && (
              <ShieldCheck className="h-3 w-3 shrink-0 text-primary" />
            )}
          </div>
        )}

        <div className="mt-auto flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {book.view_count < 50 ? "Neu veröffentlicht" : book.view_count.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="h-3 w-3" />
            {book.like_count.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            {book.chapter_count}
          </span>
        </div>
      </div>
    </Link>
  )
}
