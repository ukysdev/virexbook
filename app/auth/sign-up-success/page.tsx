import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Mail } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Check your email</h1>
        <p className="mt-2 text-muted-foreground">
          We sent you a confirmation link. Please check your email to verify your
          account and start using VirexBooks.
        </p>
        <Link href="/auth/login" className="mt-6 inline-block">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <BookOpen className="mr-2 h-4 w-4" />
            Back to Login
          </Button>
        </Link>
      </div>
    </div>
  )
}
