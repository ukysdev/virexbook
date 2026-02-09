import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          Authentication Error
        </h1>
        <p className="mt-2 text-muted-foreground">
          Something went wrong during authentication. Please try again.
        </p>
        <Link href="/auth/login" className="mt-6 inline-block">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Try Again
          </Button>
        </Link>
      </div>
    </div>
  )
}
