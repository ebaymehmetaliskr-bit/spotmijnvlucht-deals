"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Download, Mail, Users, TrendingUp, Calendar, Loader2 } from "lucide-react"
import { toast } from "react-hot-toast"

interface Subscriber {
  id: string
  email: string
  name?: string
  is_active: boolean
  subscription_type: string
  preferences: Record<string, any>
  subscribed_at: string
  last_email_sent?: string
  email_count: number
  source: string
}

export default function SubscribersManagement() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isBroadcastDialogOpen, setIsBroadcastDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [broadcastData, setBroadcastData] = useState({
    subject: "",
    content: "",
    audience: "all",
  })

  useEffect(() => {
    fetchSubscribers()
  }, [])

  const fetchSubscribers = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/subscribers")
      if (response.ok) {
        const subscribersData = await response.json()
        setSubscribers(subscribersData)
      } else {
        toast.error("Failed to fetch subscribers")
      }
    } catch (error) {
      console.error("Error fetching subscribers:", error)
      toast.error("Failed to fetch subscribers")
    } finally {
      setLoading(false)
    }
  }

  const filteredSubscribers = subscribers.filter((subscriber) => {
    const matchesSearch =
      subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.name?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "active" && subscriber.is_active) ||
      (filterStatus === "inactive" && !subscriber.is_active)

    return matchesSearch && matchesFilter
  })

  const stats = {
    total: subscribers.length,
    active: subscribers.filter((s) => s.is_active).length,
    inactive: subscribers.filter((s) => !s.is_active).length,
    avgEmailCount:
      subscribers.length > 0 ? subscribers.reduce((acc, s) => acc + s.email_count, 0) / subscribers.length : 0,
    recentSubscribers: subscribers.filter((s) => {
      const subscribeDate = new Date(s.subscribed_at)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return subscribeDate > weekAgo
    }).length,
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSubscribers(filteredSubscribers.map((subscriber) => subscriber.id))
    } else {
      setSelectedSubscribers([])
    }
  }

  const handleSelectSubscriber = (subscriberId: string, checked: boolean) => {
    if (checked) {
      setSelectedSubscribers([...selectedSubscribers, subscriberId])
    } else {
      setSelectedSubscribers(selectedSubscribers.filter((id) => id !== subscriberId))
    }
  }

  const handleExportCSV = async (selectedOnly = false) => {
    try {
      const params = selectedOnly && selectedSubscribers.length > 0 ? `?selected=${selectedSubscribers.join(",")}` : ""

      const response = await fetch(`/api/admin/subscribers/export${params}`)

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `subscribers-${new Date().toISOString().split("T")[0]}.csv`
        a.click()
        window.URL.revokeObjectURL(url)

        toast.success("Subscribers exported to CSV!")
      } else {
        toast.error("Failed to export subscribers")
      }
    } catch (error) {
      console.error("Error exporting subscribers:", error)
      toast.error("Failed to export subscribers")
    }
  }

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch("/api/admin/subscribers/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: broadcastData.subject,
          content: broadcastData.content,
          audience: broadcastData.audience,
          selectedIds: broadcastData.audience === "selected" ? selectedSubscribers : undefined,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        toast.success(`Broadcast email sent to ${result.sent} subscribers!`)
        if (result.failed > 0) {
          toast.error(`${result.failed} emails failed to send`)
        }
        setIsBroadcastDialogOpen(false)
        setBroadcastData({ subject: "", content: "", audience: "all" })
      } else {
        toast.error("Failed to send broadcast email")
      }
    } catch (error) {
      console.error("Error sending broadcast:", error)
      toast.error("Failed to send broadcast email")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading subscribers...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Subscribers Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your newsletter subscribers and send broadcasts</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => handleExportCSV(false)}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Dialog open={isBroadcastDialogOpen} onOpenChange={setIsBroadcastDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Mail className="mr-2 h-4 w-4" />
                Send Broadcast
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Send Broadcast Email</DialogTitle>
                <DialogDescription>Send an email to your subscribers</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSendBroadcast} className="space-y-4">
                <div>
                  <Label htmlFor="audience">Audience</Label>
                  <Select
                    value={broadcastData.audience}
                    onValueChange={(value) => setBroadcastData({ ...broadcastData, audience: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subscribers ({subscribers.length})</SelectItem>
                      <SelectItem value="active">Active Only ({stats.active})</SelectItem>
                      <SelectItem value="selected">Selected ({selectedSubscribers.length})</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={broadcastData.subject}
                    onChange={(e) => setBroadcastData({ ...broadcastData, subject: e.target.value })}
                    placeholder="Enter email subject"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={broadcastData.content}
                    onChange={(e) => setBroadcastData({ ...broadcastData, content: e.target.value })}
                    placeholder="Enter email content"
                    rows={8}
                    required
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsBroadcastDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Email"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All time subscribers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscribers</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(1) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Emails Sent</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgEmailCount.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Emails per subscriber</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentSubscribers}</div>
            <p className="text-xs text-muted-foreground">Recent subscriptions</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search subscribers by email or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="inactive">Inactive Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedSubscribers.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedSubscribers.length} subscriber(s) selected
              </span>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={() => handleExportCSV(true)}>
                  Export Selected
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setBroadcastData({ ...broadcastData, audience: "selected" })
                    setIsBroadcastDialogOpen(true)
                  }}
                >
                  Email Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subscribers Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Subscribers ({filteredSubscribers.length})</CardTitle>
          <CardDescription>Manage your newsletter subscribers and their preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">
                    <Checkbox
                      checked={
                        selectedSubscribers.length === filteredSubscribers.length && filteredSubscribers.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="text-left p-2">Subscriber</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Source</th>
                  <th className="text-left p-2">Emails Sent</th>
                  <th className="text-left p-2">Subscribed</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="p-2">
                      <Checkbox
                        checked={selectedSubscribers.includes(subscriber.id)}
                        onCheckedChange={(checked) => handleSelectSubscriber(subscriber.id, checked as boolean)}
                      />
                    </td>
                    <td className="p-2">
                      <div>
                        <div className="font-medium">{subscriber.email}</div>
                        {subscriber.name && (
                          <div className="text-sm text-gray-600 dark:text-gray-400">{subscriber.name}</div>
                        )}
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge variant={subscriber.is_active ? "default" : "secondary"}>
                        {subscriber.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <Badge variant="outline">{subscriber.subscription_type}</Badge>
                    </td>
                    <td className="p-2">
                      <Badge variant="outline">{subscriber.source}</Badge>
                    </td>
                    <td className="p-2">
                      <div className="text-sm">
                        <div>{subscriber.email_count} emails</div>
                        {subscriber.last_email_sent && (
                          <div className="text-gray-600 dark:text-gray-400">
                            Last: {new Date(subscriber.last_email_sent).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(subscriber.subscribed_at).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
