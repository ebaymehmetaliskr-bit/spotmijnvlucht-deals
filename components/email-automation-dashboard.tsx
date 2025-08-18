"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Users, TrendingUp, Clock, AlertTriangle } from "lucide-react"

// Mock data for demonstration
const mockEmailStats = {
  totalSubscribers: 15847,
  activeSubscribers: 14203,
  emailsSentThisWeek: 8934,
  openRate: 24.5,
  clickRate: 3.2,
  unsubscribeRate: 0.8,
  recentCampaigns: [
    { id: 1, name: "Weekly Digest #47", sent: 14203, opened: 3481, clicked: 445, date: "2024-01-15" },
    { id: 2, name: "Price Alert: Barcelona", sent: 234, opened: 89, clicked: 23, date: "2024-01-14" },
    { id: 3, name: "Welcome Series #1", sent: 156, opened: 67, clicked: 12, date: "2024-01-14" },
    { id: 4, name: "Abandoned Booking Recovery", sent: 89, opened: 34, clicked: 8, date: "2024-01-13" },
  ],
  automationRules: [
    { id: 1, name: "Welcome Series", status: "active", triggers: 156, conversions: 23 },
    { id: 2, name: "Weekly Digest", status: "active", triggers: 14203, conversions: 445 },
    { id: 3, name: "Price Drop Alerts", status: "active", triggers: 234, conversions: 23 },
    { id: 4, name: "Abandoned Booking", status: "active", triggers: 89, conversions: 8 },
  ],
}

export default function EmailAutomationDashboard() {
  const [stats, setStats] = useState(mockEmailStats)

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`
  const formatNumber = (value: number) => value.toLocaleString()

  const testEmailAutomation = async (type: string) => {
    try {
      const response = await fetch("/api/email-automation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: type,
          data: {
            subscriber: {
              id: "test-123",
              email: "test@example.com",
              firstName: "Test User",
              preferences: { newsletter: true, priceAlerts: true, weeklyDigest: true, promotions: true },
            },
          },
        }),
      })

      const result = await response.json()
      console.log(`${type} test result:`, result)
    } catch (error) {
      console.error(`Failed to test ${type}:`, error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Email Automation</h2>
          <p className="text-gray-600">Manage automated email campaigns and subscriber engagement</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.totalSubscribers)}</div>
            <p className="text-xs text-green-600">+12.5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.emailsSentThisWeek)}</div>
            <p className="text-xs text-gray-600">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(stats.openRate)}</div>
            <p className="text-xs text-green-600">+2.1% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(stats.clickRate)}</div>
            <p className="text-xs text-green-600">+0.3% from last week</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList>
          <TabsTrigger value="campaigns">Recent Campaigns</TabsTrigger>
          <TabsTrigger value="automation">Automation Rules</TabsTrigger>
          <TabsTrigger value="testing">Test Emails</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Email Campaigns</CardTitle>
              <CardDescription>Performance overview of recent email sends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentCampaigns.map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{campaign.name}</h4>
                      <p className="text-sm text-gray-600">Sent on {campaign.date}</p>
                    </div>
                    <div className="flex gap-6 text-sm">
                      <div className="text-center">
                        <div className="font-medium">{formatNumber(campaign.sent)}</div>
                        <div className="text-gray-500">Sent</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{formatNumber(campaign.opened)}</div>
                        <div className="text-gray-500">Opened</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{formatNumber(campaign.clicked)}</div>
                        <div className="text-gray-500">Clicked</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-green-600">
                          {formatPercentage((campaign.opened / campaign.sent) * 100)}
                        </div>
                        <div className="text-gray-500">Open Rate</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Automation Rules</CardTitle>
              <CardDescription>Automated email sequences and their performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.automationRules.map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant={rule.status === "active" ? "default" : "secondary"}>{rule.status}</Badge>
                      <div>
                        <h4 className="font-medium">{rule.name}</h4>
                        <p className="text-sm text-gray-600">
                          {formatNumber(rule.triggers)} triggers • {formatNumber(rule.conversions)} conversions
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-green-600">
                        {formatPercentage((rule.conversions / rule.triggers) * 100)}
                      </div>
                      <div className="text-sm text-gray-500">Conversion Rate</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Email Automation</CardTitle>
              <CardDescription>Send test emails to verify automation workflows</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={() => testEmailAutomation("welcome_series")} className="h-20 flex flex-col gap-2">
                  <Mail className="h-5 w-5" />
                  Test Welcome Series
                </Button>

                <Button
                  onClick={() => testEmailAutomation("price_alert")}
                  variant="outline"
                  className="h-20 flex flex-col gap-2"
                >
                  <AlertTriangle className="h-5 w-5" />
                  Test Price Alert
                </Button>

                <Button
                  onClick={() => testEmailAutomation("weekly_digest")}
                  variant="outline"
                  className="h-20 flex flex-col gap-2"
                >
                  <TrendingUp className="h-5 w-5" />
                  Test Weekly Digest
                </Button>

                <Button
                  onClick={() => testEmailAutomation("abandoned_booking")}
                  variant="outline"
                  className="h-20 flex flex-col gap-2"
                >
                  <Clock className="h-5 w-5" />
                  Test Abandoned Booking
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
