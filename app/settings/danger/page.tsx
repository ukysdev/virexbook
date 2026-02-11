"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { AlertTriangle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function DangerPage() {
  const [deletingAccount, setDeletingAccount] = useState(false)
  const [confirmText, setConfirmText] = useState("")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDeleteAccount = async () => {
    if (confirmText !== "I want to delete my account") {
      toast.error("Confirmation text is incorrect")
      return
    }

    setDeletingAccount(true)
    try {
      const response = await fetch("/api/settings/delete-account", {
        method: "POST",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Fehler beim Löschen des Accounts")
      }

      toast.success("Your account is being deleted...")
      // Redirect to homepage after a delay
      setTimeout(() => {
        window.location.href = "/"
      }, 2000)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error deleting account")
    } finally {
      setDeletingAccount(false)
    }
  }

  return (
    <div className="space-y-6">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          These actions cannot be undone. Please proceed with caution.
        </AlertDescription>
      </Alert>

      {/* Delete Account */}
      <Card className="border-red-200 dark:border-red-900">
        <CardHeader>
          <CardTitle className="text-red-600">Delete Account</CardTitle>
          <CardDescription>
            Delete your account and all associated data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg p-4 space-y-2">
            <p className="font-semibold text-sm text-red-800 dark:text-red-200">What happens when you delete?</p>
            <ul className="text-sm text-red-700 dark:text-red-300 space-y-1 ml-4 list-disc">
              <li>Your profile will be permanently deleted</li>
              <li>All your books and chapters will be deleted</li>
              <li>Your comments and ratings will be deleted</li>
              <li>You cannot undo this action</li>
              <li>Your data will be permanently removed from backups after 30 days</li>
            </ul>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4 space-y-2">
            <p className="font-semibold text-sm text-blue-800 dark:text-blue-200">Before deleting:</p>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 ml-4 list-disc">
              <li>
                <strong>Export your data:</strong> Go to{" "}
                <a href="/settings/privacy" className="underline hover:no-underline">
                  Privacy Settings
                </a>
                {" "}to export your data
              </li>
              <li>Download all your important content</li>
              <li>Reconsider this decision thoroughly</li>
            </ul>
          </div>

          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full sm:w-auto">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This is a permanent action and cannot be undone. Your entire account and all associated data will be deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="confirm">
                    Type the following to confirm:
                    <span className="block font-mono text-sm bg-muted p-2 rounded mt-1">
                      I want to delete my account
                    </span>
                  </Label>
                  <Input
                    id="confirm"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="Enter confirmation text..."
                    className="font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={
                    confirmText !== "I want to delete my account" || deletingAccount
                  }
                  className="bg-red-600 hover:bg-red-700"
                >
                  {deletingAccount && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Yes, delete account
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      {/* Deactivate Account (Optional) */}
      <Card>
        <CardHeader>
          <CardTitle>Deactivate Account</CardTitle>
          <CardDescription>
            Deactivate your account temporarily without deleting it
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You can reactivate your account at any time by logging in.
            While deactivated:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
            <li>Your profile is not visible</li>
            <li>Your books are not accessible</li>
            <li>Your data is retained</li>
            <li>You can log in at any time to reactivate</li>
          </ul>
          <Button variant="outline" className="w-full sm:w-auto">
            Deactivate Account
          </Button>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
          <CardDescription>
            Contact our support team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            If you have any questions or concerns, contact us at:
          </p>
          <a
            href="mailto:support@virexbooks.de"
            className="text-primary hover:underline font-medium"
          >
            support@virexbooks.de
          </a>
          <p className="text-sm text-muted-foreground mt-4">
            We will respond within 24 hours.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
