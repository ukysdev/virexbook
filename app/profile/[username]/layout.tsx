import { createClient } from "@/lib/supabase/server"
import type { Metadata } from "next"
import type { Profile } from "@/lib/types"

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{
    username: string
  }>
}

async function getProfile(username: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single()

  return data as Profile | null
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { username } = await params
  const profile = await getProfile(username)

  if (!profile) {
    return {
      title: "Profil nicht gefunden | VirexBooks",
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://virexbooks.com"
  const profileUrl = `${baseUrl}/profile/${username}`
  const description =
    profile.bio ||
    `Lese und entdecke die Werke von ${profile.display_name || profile.username} auf VirexBooks`

  return {
    title: `${profile.display_name || profile.username} | VirexBooks`,
    description,
    openGraph: {
      type: "profile",
      title: profile.display_name || profile.username,
      description,
      url: profileUrl,
      siteName: "VirexBooks",
      images: profile.avatar_url
        ? [
            {
              url: profile.avatar_url,
              width: 400,
              height: 400,
              alt: `${profile.username} Avatar`,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary",
      title: profile.display_name || profile.username,
      description,
      images: profile.avatar_url ? [profile.avatar_url] : [],
      creator: `@${profile.username}`,
    },
  }
}

export default async function ProfileLayout({ children, params }: LayoutProps) {
  const { username } = await params
  const profile = await getProfile(username)

  return (
    <>
      {/* Structured Data */}
      {profile && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: profile.display_name || profile.username,
              url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://virexbooks.com"}/profile/${profile.username}`,
              image: profile.avatar_url,
              description: profile.bio,
              identifier: profile.username,
            }),
          }}
        />
      )}
      {children}
    </>
  )
}
