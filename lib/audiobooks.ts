import type { Book, Chapter } from "@/lib/types"

export function extractAudiobookBookIds(
  chapters: Pick<Chapter, "book_id">[] | null | undefined
) {
  return Array.from(
    new Set((chapters || []).map((chapter) => chapter.book_id).filter(Boolean))
  )
}

export function markBooksAsAudiobooks<T extends Book>(
  books: T[],
  audiobookBookIds: string[]
) {
  const audiobookSet = new Set(audiobookBookIds)

  return books.map((book) =>
    audiobookSet.has(book.id) ? { ...book, has_audio: true } : book
  )
}
