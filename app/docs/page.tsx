import type { Metadata } from "next"
import {
  BookOpen,
  Headphones,
  Lock,
  Settings2,
  UserRound,
} from "lucide-react"
import { Navbar } from "@/components/navbar"

export const metadata: Metadata = {
  title: "API Docs | VirexBooks",
  description: "Interactive-style overview of the VirexBooks API and settings endpoints.",
}

const sections = [
  {
    title: "Auth",
    icon: Lock,
    items: [
      {
        method: "GET",
        path: "/api/v1/auth/me",
        description:
          "Returns the current authenticated user, linked profile, and merged user settings.",
      },
      {
        method: "POST",
        path: "/api/v1/auth/logout",
        description: "Signs out the current session.",
      },
    ],
  },
  {
    title: "Profiles",
    icon: UserRound,
    items: [
      {
        method: "GET",
        path: "/api/v1/profiles/:username",
        description: "Returns a public profile plus basic publishing stats.",
      },
    ],
  },
  {
    title: "Books",
    icon: BookOpen,
    items: [
      {
        method: "GET",
        path: "/api/v1/books",
        description:
          "List published books with optional filters for search, genre, featured, originals, staff picks, audiobook-only, sort, and limit.",
      },
      {
        method: "GET",
        path: "/api/v1/books/:bookId",
        description:
          "Returns book metadata, author data, chapter list, and audiobook counters.",
      },
      {
        method: "GET",
        path: "/api/v1/books/:bookId/chapters",
        description:
          "Returns published chapter metadata. Use `includeContent=true` to include full chapter text.",
      },
      {
        method: "GET",
        path: "/api/v1/read/progress?bookId=:bookId",
        description:
          "Returns the authenticated user's reading progress for one book.",
      },
      {
        method: "PUT",
        path: "/api/v1/read/progress",
        description:
          "Creates or updates reading progress using `book_id`, `chapter_id`, and `scroll_position`.",
      },
    ],
  },
  {
    title: "Audiobooks",
    icon: Headphones,
    items: [
      {
        method: "GET",
        path: "/api/v1/audiobooks",
        description:
          "Lists books with at least one published chapter that has an audio file.",
      },
      {
        method: "GET",
        path: "/api/v1/audiobooks/:bookId",
        description:
          "Returns audiobook metadata and all published audio chapters for a book.",
      },
      {
        method: "GET",
        path: "/api/v1/audiobooks/:bookId/stream/:chapterId",
        description:
          "Redirects with `307` to the real audio file URL for the selected chapter.",
      },
    ],
  },
  {
    title: "Settings",
    icon: Settings2,
    items: [
      {
        method: "GET",
        path: "/api/v1/settings",
        description:
          "Returns the authenticated user's preferences merged with defaults.",
      },
      {
        method: "PATCH",
        path: "/api/v1/settings",
        description:
          "Updates language, theme, autoplay, mail, analytics, privacy, and reading-preference fields.",
      },
    ],
  },
]

const settingsPayload = `{
  "preferred_language": "de",
  "theme": "system",
  "autoplay_audio": false,
  "email_notifications": true,
  "marketing_emails": false,
  "analytics_enabled": true,
  "public_profile": true,
  "show_reading_activity": true,
  "mature_content": false
}`

const progressPayload = `{
  "book_id": "uuid",
  "chapter_id": "uuid",
  "scroll_position": 0.42
}`

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-10 rounded-3xl border border-border bg-card p-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            API v1
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground">
            VirexBooks Docs
          </h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Overview of the current application API for auth, books, reading,
            audiobooks, profiles, and user settings.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-sm font-semibold text-foreground">Base path</p>
              <code className="mt-2 block text-sm text-primary">/api/v1</code>
            </div>
            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-sm font-semibold text-foreground">Auth model</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Public routes use existing Supabase RLS. Private routes require
                the current session cookie.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {sections.map((section) => {
            const Icon = section.icon

            return (
              <section
                key={section.title}
                className="rounded-3xl border border-border bg-card p-6"
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground">
                    {section.title}
                  </h2>
                </div>

                <div className="space-y-4">
                  {section.items.map((item) => (
                    <div
                      key={item.path}
                      className="rounded-2xl border border-border bg-background p-4"
                    >
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
                          {item.method}
                        </span>
                        <code className="text-sm text-foreground">{item.path}</code>
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )
          })}

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-border bg-card p-6">
              <h2 className="font-display text-2xl font-bold text-foreground">
                Progress Payload
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Example body for updating reading progress.
              </p>
              <pre className="mt-4 overflow-x-auto rounded-2xl bg-background p-4 text-sm text-foreground">
                <code>{progressPayload}</code>
              </pre>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6">
              <h2 className="font-display text-2xl font-bold text-foreground">
                Settings Payload
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Allowed fields for `PATCH /api/v1/settings`.
              </p>
              <pre className="mt-4 overflow-x-auto rounded-2xl bg-background p-4 text-sm text-foreground">
                <code>{settingsPayload}</code>
              </pre>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
