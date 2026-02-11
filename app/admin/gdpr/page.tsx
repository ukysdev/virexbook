"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { Download, Trash2, CheckCircle2, Clock, AlertCircle } from "lucide-react"

interface DataRequest {
  id: string
  user_id: string
  email: string
  request_type: string
  status: string
  requested_at: string
  completed_at?: string
  expires_at: string
}

interface DeletionRequest {
  id: string
  user_id: string
  email: string
  status: string
  requested_at: string
  scheduled_deletion_at: string
  completed_at?: string
}

export default function AdminGDPRPage() {
  const [dataRequests, setDataRequests] = useState<DataRequest[]>([])
  const [deletionRequests, setDeletionRequests] = useState<DeletionRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    async function checkAdmin() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        window.location.href = "/auth/login"
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single()

      if (!profile?.is_admin) {
        window.location.href = "/"
        return
      }

      setIsAdmin(true)
      fetchRequests()
    }

    checkAdmin()
  }, [])

  async function fetchRequests() {
    const supabase = createClient()

    const { data: dataReqs } = await supabase
      .from("data_requests")
      .select("*")
      .order("requested_at", { ascending: false })

    const { data: delReqs } = await supabase
      .from("deletion_requests")
      .select("*")
      .order("requested_at", { ascending: false })

    setDataRequests(dataReqs || [])
    setDeletionRequests(delReqs || [])
    setLoading(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!isAdmin) {
    return null
  }

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">GDPR Request Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage data export and deletion requests
        </p>
      </div>

      <Tabs defaultValue="data-requests" className="w-full">
        <TabsList>
          <TabsTrigger value="data-requests">
            Data Requests ({dataRequests.length})
          </TabsTrigger>
          <TabsTrigger value="deletion-requests">
            Deletion Requests ({deletionRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="data-requests" className="space-y-4">
          <div className="grid gap-4">
            {dataRequests.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No data requests
                </CardContent>
              </Card>
            ) : (
              dataRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader className="flex flex-row items-start justify-between space-y-0">
                    <div>
                      <CardTitle className="text-base">{request.email}</CardTitle>
                      <CardDescription className="text-xs">
                        ID: {request.user_id}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(request.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(request.status)}
                        {request.status}
                      </span>
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Request Type</p>
                        <p className="font-medium">{request.request_type}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Requested On</p>
                        <p className="font-medium">
                          {format(new Date(request.requested_at), "MMM dd yyyy HH:mm")}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Expires On</p>
                        <p className="font-medium">
                          {format(new Date(request.expires_at), "MMM dd yyyy")}
                        </p>
                      </div>
                      {request.completed_at && (
                        <div>
                          <p className="text-muted-foreground">Completed On</p>
                          <p className="font-medium">
                            {format(new Date(request.completed_at), "MMM dd yyyy HH:mm")}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-4 border-t">
                      {request.status === "pending" && (
                        <>
                          <Button size="sm" variant="outline" className="gap-2">
                            <Download className="h-4 w-4" />
                            Export & Send Data
                          </Button>
                          <Button size="sm" variant="outline" className="gap-2 text-red-600">
                            <Trash2 className="h-4 w-4" />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="deletion-requests" className="space-y-4">
          <div className="grid gap-4">
            {deletionRequests.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No deletion requests
                </CardContent>
              </Card>
            ) : (
              deletionRequests.map((request) => {
                const isExpired =
                  new Date(request.scheduled_deletion_at) < new Date()
                return (
                  <Card
                    key={request.id}
                    className={isExpired && request.status === "pending" ? "border-red-300" : ""}
                  >
                    <CardHeader className="flex flex-row items-start justify-between space-y-0">
                      <div>
                        <CardTitle className="text-base">{request.email}</CardTitle>
                        <CardDescription className="text-xs">
                          ID: {request.user_id}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(request.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(request.status)}
                          {request.status}
                        </span>
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Requested On</p>
                          <p className="font-medium">
                            {format(new Date(request.requested_at), "MMM dd yyyy HH:mm")}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Scheduled For</p>
                          <p className={`font-medium ${
                            isExpired && request.status === "pending"
                              ? "text-red-600 font-bold"
                              : ""
                          }`}>
                            {format(new Date(request.scheduled_deletion_at), "MMM dd yyyy")}
                            {isExpired && request.status === "pending" && (
                              <span className="ml-2 text-xs">(EXPIRED)</span>
                            )}
                          </p>
                        </div>
                        {request.completed_at && (
                          <div className="col-span-2">
                            <p className="text-muted-foreground">Deleted On</p>
                            <p className="font-medium">
                              {format(new Date(request.completed_at), "MMM dd yyyy HH:mm")}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 pt-4 border-t">
                        {isExpired && request.status === "pending" && (
                          <Button
                            size="sm"
                            variant="destructive"
                            className="gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete Now
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
