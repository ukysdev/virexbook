# VirexBooks API v1

Base path: `/api/v1`

Authentication:
- Public endpoints use the current Supabase RLS rules.
- Private endpoints require a logged-in user via the existing auth session cookie.

## Auth

### `GET /api/v1/auth/me`
Returns the current authenticated user, profile, and merged user settings.

### `POST /api/v1/auth/logout`
Signs out the current session.

## Profiles

### `GET /api/v1/profiles/:username`
Returns a public profile and basic stats.

## Books

### `GET /api/v1/books`
Query parameters:
- `q`: text search across title, description, tags, and author fields
- `genre`: exact genre
- `featured=true`
- `originals=true`
- `staffPicks=true`
- `audiobookOnly=true`
- `sort=popular|newest`
- `limit=1..100`

### `GET /api/v1/books/:bookId`
Returns book metadata plus published chapter metadata and audiobook counts.

### `GET /api/v1/books/:bookId/chapters`
Query parameters:
- `includeContent=true` to include chapter content

## Reading

### `GET /api/v1/read/progress?bookId=:bookId`
Returns the authenticated user's progress for a book.

### `PUT /api/v1/read/progress`
Body:

```json
{
  "book_id": "uuid",
  "chapter_id": "uuid",
  "scroll_position": 0.42
}
```

## Audiobooks

### `GET /api/v1/audiobooks`
Lists all books with at least one published chapter that has `audio_url`.

Query parameters:
- `q`
- `limit=1..100`

### `GET /api/v1/audiobooks/:bookId`
Returns audiobook metadata plus all published audio chapters.

### `GET /api/v1/audiobooks/:bookId/stream/:chapterId`
Redirects with `307` to the underlying chapter audio file URL.

## Settings

### `GET /api/v1/settings`
Returns the authenticated user's settings merged with defaults.

### `PATCH /api/v1/settings`
Allowed fields:

```json
{
  "preferred_language": "de",
  "theme": "system",
  "autoplay_audio": false,
  "email_notifications": true,
  "marketing_emails": false,
  "analytics_enabled": true,
  "public_profile": true,
  "show_reading_activity": true,
  "mature_content": false
}
```

## Database migration

Run the new SQL migration before using the settings endpoint:

- `scripts/006_user_settings.sql`

This creates `public.user_settings` with RLS policies for per-user access.
