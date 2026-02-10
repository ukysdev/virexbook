"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { toast } from "sonner"
import {
  Share2,
  Copy,
  Mail,
  Check,
} from "lucide-react"

interface ShareButtonProps {
  title: string
  description?: string
  url: string
  variant?: "default" | "outline" | "ghost"
  className?: string
}

export function ShareButton({
  title,
  description,
  url,
  variant = "outline",
  className,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success("Link kopiert!")
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error("Fehler beim Kopieren des Links")
    }
  }

  const encodeURL = encodeURIComponent(url)
  const encodeTitle = encodeURIComponent(title)
  const encodeDesc = description ? encodeURIComponent(description) : ""

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeTitle}&url=${encodeURL}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURL}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURL}`,
    reddit: `https://reddit.com/submit?title=${encodeTitle}&url=${encodeURL}`,
    email: `mailto:?subject=${encodeTitle}&body=${encodeDesc}%0A%0A${encodeURL}`,
  }

  const handleNativeShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: title,
          text: description || "",
          url: url,
        })
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        toast.error("Sharing fehlgeschlagen")
      }
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={variant} className={className}>
          <Share2 className="w-4 h-4 mr-2" />
          Teilen
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Teilen</SheetTitle>
          <SheetDescription>
            Teile dieses Buch oder diese Episode mit Freunden
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 py-6">
          {/* Copy Link */}
          <div className="space-y-2">
            <p className="text-sm font-semibold">Link kopieren</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={url}
                readOnly
                className="flex-1 text-sm bg-secondary rounded px-3 py-2 border border-secondary-foreground/30"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t my-4" />

          {/* Social Media Share */}
          <div className="space-y-2">
            <p className="text-sm font-semibold">Auf Social Media teilen</p>
            <div className="grid grid-cols-2 gap-2">
              <a
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7" />
                </svg>
                X
              </a>

              <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 rounded transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a6 6 0 00-6 6v3H7v4h2v8h4v-8h3l1-4h-4V8a2 2 0 012-2h3z" />
                </svg>
                Facebook
              </a>

              <a
                href={shareLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-700/10 hover:bg-blue-700/20 text-blue-700 rounded transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
                LinkedIn
              </a>

              <a
                href={shareLinks.reddit}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-3 py-2 text-sm bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 rounded transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0A12 12 0 110 12 12 12 0 0112 0zm5 8.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm-10 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 9c-2.5 0-4.7-1.2-6-3H7c2.5 2 5.5 3 8 3s5.5-1 8-3h-4c-1.3 1.8-3.5 3-6 3z" />
                </svg>
                Reddit
              </a>

              <a
                href={shareLinks.email}
                className="flex items-center justify-center gap-2 px-3 py-2 text-sm bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 rounded transition-colors"
              >
                <Mail className="w-4 h-4" />
                E-Mail
              </a>

              {typeof navigator !== "undefined" &&
                typeof navigator.share !== "undefined" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleNativeShare}
                    className="col-span-1"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Mehr
                  </Button>
                )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
