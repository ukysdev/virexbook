import { createClient } from "@/lib/supabase/server"
import type { Metadata, MetadataRoute } from "next"
import type { Book, Profile } from "@/lib/types"

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{
    bookId: string
  }>
}

async function getBook(bookId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("books")
    .select("*, profiles(*)")
    .eq("id", bookId)
    .single()

  return data as (Book & { profiles?: Profile }) | null
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { bookId } = await params
  const book = await getBook(bookId)

  if (!book) {
    return {
      title: "Buch nicht gefunden | VirexBooks",
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://virexbooks.com"
  const bookUrl = `${baseUrl}/book/${bookId}`
  const description = book.description
    ? book.description.substring(0, 160)
    : `Lese ${book.title} von ${book.profiles?.display_name || book.profiles?.username || "Unbekannter Autor"} auf VirexBooks`

  return {
    title: `${book.title} | VirexBooks`,
    description,
    keywords: [book.genre, ...(book.tags || [])].filter(Boolean),
    authors: book.profiles
      ? [
          {
            name: book.profiles.display_name || book.profiles.username,
            url: `${baseUrl}/profile/${book.profiles.username}`,
          },
        ]
      : [],
    openGraph: {
      type: "website",
      title: book.title,
      description,
      url: bookUrl,
      siteName: "VirexBooks",
      images: book.cover_url
        ? [
            {
              url: book.cover_url,
              width: 400,
              height: 600,
              alt: book.title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: book.title,
      description,
      images: book.cover_url ? [book.cover_url] : [],
      creator: book.profiles ? `@${book.profiles.username}` : undefined,
    },
  }
}

export default async function BookLayout({ children, params }: LayoutProps) {
  const { bookId } = await params
  const book = await getBook(bookId)

  return (
    <>
      {/* Structured Data für besseres SEO */}
      {book && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Book",
              name: book.title,
              description: book.description,
              image: book.cover_url,
              author: {
                "@type": "Person",
                name:
                  book.profiles?.display_name ||
                  book.profiles?.username ||
                  "Unknown Author",
              },
              genre: book.genre,
              publisher: {
                "@type": "Organization",
                name: "VirexBooks",
              },
            }),
          }}
        />
      )}
      {children}
    </>
  )
}
