"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  User,
  Shield,
  AlertTriangle,
} from "lucide-react"

const routes = [
  {
    label: "Overview",
    href: "/settings",
    icon: User,
  },
  {
    label: "Account",
    href: "/settings/account",
    icon: User,
  },
  {
    label: "Privacy",
    href: "/settings/privacy",
    icon: Shield,
  },
  {
    label: "Danger Zone",
    href: "/settings/danger",
    icon: AlertTriangle,
  },
]

export function SettingsSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r bg-muted/40 hidden md:block sticky top-0 h-screen">
      <div className="p-6 space-y-3">
        <h2 className="text-lg font-semibold">Settings</h2>
        <nav className="space-y-2">
          {routes.map((route) => {
            const Icon = route.icon
            const isActive = pathname === route.href || pathname.startsWith(route.href + "/")
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {route.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden p-4 border-t">
        <div className="text-xs text-muted-foreground">
          More options available on mobile devices
        </div>
      </div>
    </aside>
  )
}
