import { DiscoverBooksPage } from "@/components/discover-books-page"

export default function AudiobooksPage() {
  return (
    <DiscoverBooksPage
      title="Explore Audiobooks"
      description="Listen to books with published audiobook chapters from the community."
      forcedFilter="audiobooks"
    />
  )
}
