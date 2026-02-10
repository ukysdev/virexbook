import { createClient } from "@/lib/supabase/server"
import type { Metadata } from "next"
import type { Chapter, Book } from "@/lib/types"

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{
    bookId: string
    chapterId: string
  }>
}

async function getChapterData(bookId: string, chapterId: string) {
  const supabase = await createClient()
  const [bookRes, chapterRes, chaptersRes] = await Promise.all([
    supabase.from("books").select("*").eq("id", bookId).single(),
    supabase.from("chapters").select("*").eq("id", chapterId).single(),
    supabase
      .from("chapters")
      .select("id, title, order_index")
      .eq("book_id", bookId)
      .eq("status", "published")
      .order("order_index", { ascending: true }),
  ])

  return {
    book: bookRes.data as Book | null,
    chapter: chapterRes.data as Chapter | null,
    chapters: (chaptersRes.data as Chapter[]) || [],
  }
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { bookId, chapterId } = await params
  const { book, chapter, chapters } = await getChapterData(bookId, chapterId)

  if (!book || !chapter) {
    return {
      title: "Kapitel nicht gefunden | VirexBooks",
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://virexbooks.com"
  const chapterUrl = `${baseUrl}/book/${bookId}/read/${chapterId}`
  const currentIndex = chapters.findIndex((c) => c.id === chapterId)
  const readingTime = Math.max(1, Math.ceil(chapter.word_count / 200))

  const description = `Kapitel ${currentIndex + 1}: ${chapter.title} - ${book.title}. ${readingTime} Minuten Lesezeit. (~${chapter.word_count} Wörter)`

  return {
    title: `${chapter.title} | ${book.title} | VirexBooks`,
    description,
    openGraph: {
      type: "article",
      title: `${chapter.title} - ${book.title}`,
      description,
      url: chapterUrl,
      siteName: "VirexBooks",
      images: book.cover_url
        ? [
            {
              url: book.cover_url,
              width: 400,
              height: 600,
              alt: `${book.title} - Cover`,
            },
          ]
        : [],
      publishedTime: chapter.created_at,
      authors: book.profiles
        ? [book.profiles.display_name || book.profiles.username]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${chapter.title} - ${book.title}`,
      description,
      images: book.cover_url ? [book.cover_url] : [],
    },
  }
}

export default async function ChapterLayout({ children, params }: LayoutProps) {
  const { bookId, chapterId } = await params
  const { book, chapter, chapters } = await getChapterData(bookId, chapterId)

  return (
    <>
      {/* Structured Data */}
      {book && chapter && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: chapter.title,
              description: `Kapitel ${chapters.findIndex((c) => c.id === chapterId) + 1} von ${book.title}`,
              image: book.cover_url,
              author: {
                "@type": "Person",
                name: book.profiles?.display_name || book.profiles?.username,
              },
              datePublished: chapter.created_at,
              wordCount: chapter.word_count,
            }),
          }}
        />
      )}
      {children}
    </>
  )
}
