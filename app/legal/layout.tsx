import React from "react"
import { Navbar } from "@/components/navbar"
import Link from "next/link"

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
        {/* Navigation Breadcrumb */}
        <nav className="mb-8 flex gap-4 flex-wrap">
          <Link
            href="/legal/imprint"
            className="text-sm hover:underline text-muted-foreground hover:text-foreground"
          >
            Impressum
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link
            href="/legal/privacy"
            className="text-sm hover:underline text-muted-foreground hover:text-foreground"
          >
            Datenschutz
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link
            href="/legal/terms"
            className="text-sm hover:underline text-muted-foreground hover:text-foreground"
          >
            AGB
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link
            href="/legal/cookies"
            className="text-sm hover:underline text-muted-foreground hover:text-foreground"
          >
            Cookies
          </Link>
        </nav>

        {/* Main Content */}
        <article className="prose prose-invert max-w-none dark:prose-invert">
          {children}
        </article>
      </div>
    </div>
  )
}
