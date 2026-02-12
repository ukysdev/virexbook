export interface Profile {
  id: string
  username: string
  display_name: string | null
  bio: string | null
  avatar_url: string | null
  is_verified: boolean
  is_staff: boolean
  is_admin: boolean
  follower_count: number
  following_count: number
  created_at: string
  updated_at: string
}

export interface Book {
  id: string
  user_id: string
  title: string
  description: string | null
  cover_url: string | null
  genre: string
  tags: string[]
  status: 'draft' | 'published' | 'archived'
  is_original: boolean
  is_staff_pick: boolean
  is_featured: boolean
  view_count: number
  like_count: number
  chapter_count: number
  language: string
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface Chapter {
  id: string
  book_id: string
  user_id: string
  title: string
  content: string
  order_index: number
  status: 'draft' | 'published'
  publish_at?: string | null
  word_count: number
  view_count: number
  created_at: string
  updated_at: string
}

export interface Comment {
  id: string
  user_id: string
  chapter_id: string
  content: string
  created_at: string
  profiles?: Profile
}

export interface ReadingProgress {
  id: string
  user_id: string
  book_id: string
  chapter_id: string | null
  scroll_position: number
  updated_at: string
  books?: Book
  chapters?: Chapter
}

export interface ReadingList {
  id: string
  user_id: string
  book_id: string
  created_at: string
  books?: Book
}

export const GENRES = [
  'Fantasy',
  'Romance',
  'Sci-Fi',
  'Thriller',
  'Horror',
  'Mystery',
  'Adventure',
  'Drama',
  'Comedy',
  'Poetry',
  'Fan Fiction',
  'Non-Fiction',
  'Other',
] as const

export type Genre = (typeof GENRES)[number]
