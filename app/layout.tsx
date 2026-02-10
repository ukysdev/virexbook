import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import { Toaster } from "sonner"
import { Footer } from "@/components/footer"

import "./globals.css"

const _inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const _spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

export const metadata: Metadata = {
  title: "VirexBooks - Write, Share & Discover Stories",
  description:
    "VirexBooks is a platform where authors write, share, and discover amazing stories. Join a community of readers and writers.",
}

export const viewport: Viewport = {
  themeColor: "#f97316",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de">
      <body className="font-sans antialiased bg-background text-foreground min-h-screen flex flex-col">
        <div className="flex-1">{children}</div>
        <Footer />
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  )
}
