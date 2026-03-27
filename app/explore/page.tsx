import {
  DiscoverBooksPage,
  type ExploreFilter,
} from "@/components/discover-books-page"

function normalizeFilter(value?: string): ExploreFilter {
  switch (value) {
    case "originals":
    case "featured":
    case "staff_picks":
    case "popular":
    case "audiobooks":
      return value
    default:
      return "all"
  }
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams?: Promise<{ filter?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const initialFilter = normalizeFilter(resolvedSearchParams?.filter)

  return (
    <DiscoverBooksPage
      title="Explore Stories"
      description="Discover new stories from talented authors"
      initialFilter={initialFilter}
    />
  )
}
