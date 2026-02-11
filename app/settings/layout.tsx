"use client"

import { ReactNode } from "react"
import { Navbar } from "@/components/navbar"
import { SettingsSidebar } from "@/components/settings-sidebar"
import { Separator } from "@/components/ui/separator"

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-background">
        <SettingsSidebar />
        <main className="flex-1 overflow-auto">
          <div className="border-b">
            <div className="container max-w-4xl py-8">
              <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            </div>
          </div>
          <div className="container max-w-4xl py-8">
            {children}
          </div>
        </main>
      </div>
    </>
  )
}
