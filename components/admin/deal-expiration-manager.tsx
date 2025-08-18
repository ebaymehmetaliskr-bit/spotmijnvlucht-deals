"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Clock, AlertTriangle, CheckCircle, XCircle, Calendar, Loader2 } from "lucide-react"
import { toast } from "react-hot-toast"

interface DealWithExpiration {
  id: string
  destination: string
  country: string
  current_price: number
  original_price: number
  airline: string
  deal_expiration: string
  is_active: boolean
  expiration_status: string
  hours_until_expiration: number
  seats_available: number
}

export default function DealExpirationManager() {
  const [deals, setDeals] = useState<DealWithExpiration[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDeals, setSelectedDeals] = useState<string[]>([])
  const [filterStatus, setFilterStatus] = useState("all")
  const [isExtendDialogOpen, setIsExtendDialogOpen] = useState(false)
  const [newExpirationDate, setNewExpirationDate] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchDeals()
  }, [filterStatus])

  const fetchDeals = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/deals/expiration?status=${filterStatus}`)

      if (response.ok) {
        const dealsData = await response.json()
        setDeals(dealsData)
      } else {
        toast.error("Failed to fetch deals")
      }
    } catch (error) {
      console.error("Error fetching deals:", error)
      toast.error("Failed to fetch deals")
    } finally {
      setLoading(false)
    }
  }

  const handleBulkAction = async (action: string) => {
    if (selectedDeals.length === 0) {
      toast.error("Please select deals first")
      return
    }

    setSubmitting(true)

    try {
      const requestBody: any = {
        action,
        dealIds: selectedDeals,
      }

      if (action === "extend" && newExpirationDate) {
        requestBody.newExpirationDate = newExpirationDate
      }

      const response = await fetch("/api/admin/deals/expiration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })

      if (response.ok) {
        const result = await response.json()
        toast.success(result.message)
        setSelectedDeals([])
        setIsExtendDialogOpen(false)
        setNewExpirationDate("")
        await fetchDeals()
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to perform action")
      }
    } catch (error) {
      console.error("Error performing bulk action:", error)
      toast.error("Failed to perform action")
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusBadge = (status: string, hoursUntilExpiration: number) => {
    switch (status) {
      case "expired":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Expired
          </Badge>
        )
      case "expiring_soon":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            {hoursUntilExpiration}h left
          </Badge>
        )
      case "expiring_this_week":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {Math.round(hoursUntilExpiration / 24)}d left
          </Badge>
        )
      default:
        return (
          <Badge variant="default" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Active
          </Badge>
        )
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDeals(deals.map((deal) => deal.id))
    } else {
      setSelectedDeals([])
    }
  }

  const handleSelectDeal = (dealId: string, checked: boolean) => {
    if (checked) {
      setSelectedDeals([...selectedDeals, dealId])
    } else {
      setSelectedDeals(selectedDeals.filter((id) => id !== dealId))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading deals...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Deal Expiration Manager</h1>
          <p className="text-gray-600 dark:text-gray-400">Monitor and manage deal expiration dates</p>
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Deals</SelectItem>
            <SelectItem value="active">Active Deals</SelectItem>
            <SelectItem value="expiring_soon">Expiring Soon</SelectItem>
            <SelectItem value="expired">Expired Deals</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {deals.filter((d) => d.is_active && d.expiration_status === "active").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {deals.filter((d) => d.expiration_status === "expiring_soon").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deals.filter((d) => d.expiration_status === "expired").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {deals.filter((d) => d.expiration_status === "expiring_this_week").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Actions */}
      {selectedDeals.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">{selectedDeals.length} deal(s) selected</span>
              <div className="flex space-x-2">
                <Dialog open={isExtendDialogOpen} onOpenChange={setIsExtendDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Calendar className="mr-2 h-4 w-4" />
                      Extend
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Extend Deal Expiration</DialogTitle>
                      <DialogDescription>Set a new expiration date for selected deals</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="newDate">New Expiration Date</Label>
                        <Input
                          id="newDate"
                          type="datetime-local"
                          value={newExpirationDate}
                          onChange={(e) => setNewExpirationDate(e.target.value)}
                          min={new Date().toISOString().slice(0, 16)}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsExtendDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => handleBulkAction("extend")} disabled={!newExpirationDate || submitting}>
                          {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                          Extend Deals
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button size="sm" variant="outline" onClick={() => handleBulkAction("reactivate")}>
                  Reactivate
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="destructive">
                      Expire Now
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Expire Selected Deals</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to expire {selectedDeals.length} deal(s)? This will deactivate them
                        immediately.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleBulkAction("expire_now")}>Expire Now</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Deals Table */}
      <Card>
        <CardHeader>
          <CardTitle>Deals by Expiration ({deals.length})</CardTitle>
          <CardDescription>Monitor and manage deal expiration dates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">
                    <Checkbox
                      checked={selectedDeals.length === deals.length && deals.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="text-left p-2">Deal</th>
                  <th className="text-left p-2">Price</th>
                  <th className="text-left p-2">Expiration</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Seats</th>
                </tr>
              </thead>
              <tbody>
                {deals.map((deal) => (
                  <tr key={deal.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="p-2">
                      <Checkbox
                        checked={selectedDeals.includes(deal.id)}
                        onCheckedChange={(checked) => handleSelectDeal(deal.id, checked as boolean)}
                      />
                    </td>
                    <td className="p-2">
                      <div>
                        <div className="font-medium">{deal.destination}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{deal.airline}</div>
                      </div>
                    </td>
                    <td className="p-2">
                      <div>
                        <div className="font-medium text-green-600">€{deal.current_price}</div>
                        <div className="text-sm text-gray-500 line-through">€{deal.original_price}</div>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="text-sm">
                        <div>{new Date(deal.deal_expiration).toLocaleDateString()}</div>
                        <div className="text-gray-600 dark:text-gray-400">
                          {new Date(deal.deal_expiration).toLocaleTimeString()}
                        </div>
                      </div>
                    </td>
                    <td className="p-2">{getStatusBadge(deal.expiration_status, deal.hours_until_expiration)}</td>
                    <td className="p-2">
                      <Badge variant={deal.seats_available <= 3 ? "destructive" : "outline"}>
                        {deal.seats_available} left
                      </Badge>
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
