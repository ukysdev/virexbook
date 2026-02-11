"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Download, FileJson, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export default function PrivacyPage() {
  const [exportingData, setExportingData] = useState(false)
  const [requestingData, setRequestingData] = useState(false)
  const [dataConsent, setDataConsent] = useState(false)

  const handleExportData = async () => {
    if (!dataConsent) {
      toast.error("Bitte akzeptiere die Bedingungen")
      return
    }

    setExportingData(true)
    try {
      const response = await fetch("/api/settings/export-data", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Fehler beim Datenexport")
      }

      // Get the blob and create download link
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `virexbooks-data-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success("Daten erfolgreich exportiert")
    } catch (error) {
      toast.error("Error exporting data")
    } finally {
      setExportingData(false)
    }
  }

  const handleRequestData = async () => {
    setRequestingData(true)
    try {
      const response = await fetch("/api/settings/request-data", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Error submitting request")
      }

      toast.success("Your data request has been submitted. You will receive an email with your data within 30 days.")
    } catch (error) {
      toast.error("Error submitting data request")
    } finally {
      setRequestingData(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* GDPR Information */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Your Privacy Rights:</strong> Under GDPR, you have the right to access, correct, or delete your data. These tools help you exercise your rights.
        </AlertDescription>
      </Alert>

      {/* Data Export */}
      <Card>
        <CardHeader>
          <CardTitle>Export Data</CardTitle>
          <CardDescription>
            Download all your personal data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This function exports all your data in machine-readable JSON format:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
            <li>Profile data (name, bio, avatar)</li>
            <li>All published and draft books</li>
            <li>All chapters and content</li>
            <li>Comments and interactions</li>
            <li>Followers and following lists</li>
          </ul>
          
          <div className="space-y-3 pt-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="consent-export"
                checked={dataConsent}
                onCheckedChange={(checked) => setDataConsent(checked as boolean)}
              />
              <Label htmlFor="consent-export" className="font-normal cursor-pointer">
                I confirm that I want to export my data and have read the privacy policy
              </Label>
            </div>
            <Button
              onClick={handleExportData}
              disabled={!dataConsent || exportingData}
              className="w-full sm:w-auto"
            >
              {exportingData && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Download className="mr-2 h-4 w-4" />
              Export Data Now
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Request */}
      <Card>
        <CardHeader>
          <CardTitle>Official Data Request (GDPR Art. 15)</CardTitle>
          <CardDescription>
            Request a formal copy of all your personal data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This is a formal GDPR request. You will receive:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
            <li>All your personal data</li>
            <li>Information about processing</li>
            <li>Data origination details</li>
            <li>Details about sharing with third parties</li>
          </ul>
          
          <p className="text-sm font-medium text-foreground pt-4">
            Notice: This request will be processed and you will receive the data within 30 days via email.
          </p>

          <Button
            onClick={handleRequestData}
            disabled={requestingData}
            variant="outline"
            className="w-full sm:w-auto"
          >
            {requestingData && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <FileJson className="mr-2 h-4 w-4" />
            Request Data
          </Button>
        </CardContent>
      </Card>

      {/* Data Correction */}
      <Card>
        <CardHeader>
          <CardTitle>Correct Data (GDPR Art. 16)</CardTitle>
          <CardDescription>
            Fix inaccurate information in your profile
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You can edit your profile data at any time:
          </p>
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => window.location.href = '/profile'}
          >
            Go to Profile
          </Button>
        </CardContent>
      </Card>

      {/* Tracking & Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy Preferences</CardTitle>
          <CardDescription>
            Manage your tracking and analytics settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="analytics" className="font-normal">
                <span className="font-medium">Allow Analytics</span>
                <p className="text-sm text-muted-foreground">Help us improve the platform</p>
              </Label>
              <Checkbox id="analytics" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="marketing" className="font-normal">
                <span className="font-medium">Marketing Cookies</span>
                <p className="text-sm text-muted-foreground">Personalized content and offers</p>
              </Label>
              <Checkbox id="marketing" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
