"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CookieConsent() {
  const [shown, setShown] = useState(false)
  const [consent, setConsent] = useState<{
    analytics: boolean
    marketing: boolean
  } | null>(null)

  useEffect(() => {
    // Check if user has already given consent
    const savedConsent = localStorage.getItem("cookie-consent")
    if (savedConsent) {
      setConsent(JSON.parse(savedConsent))
      return
    }
    
    // Show banner after 2 seconds
    const timer = setTimeout(() => {
      setShown(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleAcceptAll = () => {
    const consent = { analytics: true, marketing: true }
    localStorage.setItem("cookie-consent", JSON.stringify(consent))
    setConsent(consent)
    setShown(false)
  }

  const handleAcceptEssential = () => {
    const consent = { analytics: false, marketing: false }
    localStorage.setItem("cookie-consent", JSON.stringify(consent))
    setConsent(consent)
    setShown(false)
  }

  if (!shown || consent) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border p-4">
      <div className="container max-w-7xl mx-auto flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-semibold mb-2">Cookies & Privacy</h3>
          <p className="text-sm text-muted-foreground mb-2">
            We use cookies to improve your experience. Read more in our{" "}
            <Link href="/legal/data-privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
          <p className="text-xs text-muted-foreground">
            Essential cookies are always active. You can manage additional cookies in your{" "}
            <Link href="/settings/privacy" className="text-primary hover:underline">
              Privacy Settings
            </Link>
            .
          </p>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAcceptEssential}
          >
            Decline
          </Button>
          <Button
            size="sm"
            onClick={handleAcceptAll}
          >
            Accept
          </Button>
          <button
            onClick={() => setShown(false)}
            className="p-1 hover:bg-secondary rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
