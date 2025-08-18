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
import { Plus, Edit, Trash2, Search, Filter, Loader2 } from "lucide-react"
import { toast } from "react-hot-toast"

interface Deal {
  id: string
  destination: string
  country: string
  origin: string
  current_price: number
  original_price: number
  discount_percentage: number
  airline: string
  departure_date: string
  return_date: string
  deal_expiration: string
  seats_available: number
  affiliate_url: string
  is_featured: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function DealsManagement() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDeals, setSelectedDeals] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    destination: "",
    country: "",
    origin: "Amsterdam",
    currentPrice: "",
    originalPrice: "",
    airline: "",
    departureDate: "",
    returnDate: "",
    expirationDate: "",
    seatsAvailable: "",
    affiliateUrl: "",
    featured: false,
    active: true,
  })

  useEffect(() => {
    fetchDeals()
  }, [])

  const fetchDeals = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/deals")
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

  const filteredDeals = deals.filter((deal) => {
    const matchesSearch =
      deal.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.airline.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "active" && deal.is_active) ||
      (filterStatus === "inactive" && !deal.is_active) ||
      (filterStatus === "featured" && deal.is_featured)

    return matchesSearch && matchesFilter
  })

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDeals(filteredDeals.map((deal) => deal.id))
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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const dealData = {
        ...formData,
        currentPrice: Number.parseFloat(formData.currentPrice),
        originalPrice: Number.parseFloat(formData.originalPrice),
        seatsAvailable: Number.parseInt(formData.seatsAvailable),
      }

      if (editingDeal) {
        // Update existing deal
        const response = await fetch("/api/admin/deals", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingDeal.id, ...dealData }),
        })

        if (response.ok) {
          toast.success("Deal updated successfully!")
          setEditingDeal(null)
          await fetchDeals()
        } else {
          toast.error("Failed to update deal")
        }
      } else {
        // Add new deal
        const response = await fetch("/api/admin/deals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dealData),
        })

        if (response.ok) {
          toast.success("Deal added successfully!")
          setIsAddDialogOpen(false)
          await fetchDeals()
        } else {
          toast.error("Failed to add deal")
        }
      }

      // Reset form
      setFormData({
        destination: "",
        country: "",
        origin: "Amsterdam",
        currentPrice: "",
        originalPrice: "",
        airline: "",
        departureDate: "",
        returnDate: "",
        expirationDate: "",
        seatsAvailable: "",
        affiliateUrl: "",
        featured: false,
        active: true,
      })
    } catch (error) {
      console.error("Error saving deal:", error)
      toast.error("Failed to save deal")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (deal: Deal) => {
    setEditingDeal(deal)
    setFormData({
      destination: deal.destination,
      country: deal.country,
      origin: deal.origin,
      currentPrice: deal.current_price.toString(),
      originalPrice: deal.original_price.toString(),
      airline: deal.airline,
      departureDate: deal.departure_date,
      returnDate: deal.return_date,
      expirationDate: deal.deal_expiration.split("T")[0], // Convert to date format
      seatsAvailable: deal.seats_available.toString(),
      affiliateUrl: deal.affiliate_url,
      featured: deal.is_featured,
      active: deal.is_active,
    })
  }

  const handleDelete = async (dealId: string) => {
    try {
      const response = await fetch(`/api/admin/deals?id=${dealId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Deal deleted successfully!")
        await fetchDeals()
      } else {
        toast.error("Failed to delete deal")
      }
    } catch (error) {
      console.error("Error deleting deal:", error)
      toast.error("Failed to delete deal")
    }
  }

  const handleBulkAction = async (action: string) => {
    try {
      // For now, handle bulk actions one by one
      // In a real implementation, you'd want a bulk API endpoint
      const promises = selectedDeals.map(async (dealId) => {
        const deal = deals.find((d) => d.id === dealId)
        if (!deal) return

        let updateData: any = {}
        switch (action) {
          case "activate":
            updateData = { ...deal, active: true }
            break
          case "deactivate":
            updateData = { ...deal, active: false }
            break
          case "feature":
            updateData = { ...deal, featured: true }
            break
          case "delete":
            return fetch(`/api/admin/deals?id=${dealId}`, { method: "DELETE" })
        }

        if (action !== "delete") {
          return fetch("/api/admin/deals", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: dealId, ...updateData }),
          })
        }
      })

      await Promise.all(promises)

      switch (action) {
        case "activate":
          toast.success(`${selectedDeals.length} deals activated`)
          break
        case "deactivate":
          toast.success(`${selectedDeals.length} deals deactivated`)
          break
        case "feature":
          toast.success(`${selectedDeals.length} deals featured`)
          break
        case "delete":
          toast.success(`${selectedDeals.length} deals deleted`)
          break
      }

      setSelectedDeals([])
      await fetchDeals()
    } catch (error) {
      console.error("Error with bulk action:", error)
      toast.error("Failed to perform bulk action")
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Deals Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your flight deals and offers</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Deal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Deal</DialogTitle>
              <DialogDescription>Create a new flight deal with all the details</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* ... existing form fields ... */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="destination">Destination</Label>
                  <Input
                    id="destination"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="origin">Origin</Label>
                  <Select
                    value={formData.origin}
                    onValueChange={(value) => setFormData({ ...formData, origin: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Amsterdam">Amsterdam</SelectItem>
                      <SelectItem value="Rotterdam">Rotterdam</SelectItem>
                      <SelectItem value="Eindhoven">Eindhoven</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="currentPrice">Current Price (€)</Label>
                  <Input
                    id="currentPrice"
                    type="number"
                    step="0.01"
                    value={formData.currentPrice}
                    onChange={(e) => setFormData({ ...formData, currentPrice: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="originalPrice">Original Price (€)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="airline">Airline</Label>
                <Input
                  id="airline"
                  value={formData.airline}
                  onChange={(e) => setFormData({ ...formData, airline: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="departureDate">Departure Date</Label>
                  <Input
                    id="departureDate"
                    type="date"
                    value={formData.departureDate}
                    onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="returnDate">Return Date</Label>
                  <Input
                    id="returnDate"
                    type="date"
                    value={formData.returnDate}
                    onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="expirationDate">Deal Expiration</Label>
                  <Input
                    id="expirationDate"
                    type="date"
                    value={formData.expirationDate}
                    onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="seatsAvailable">Seats Available</Label>
                  <Input
                    id="seatsAvailable"
                    type="number"
                    value={formData.seatsAvailable}
                    onChange={(e) => setFormData({ ...formData, seatsAvailable: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Options</Label>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={(checked) => setFormData({ ...formData, featured: checked as boolean })}
                      />
                      <Label htmlFor="featured">Featured</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="active"
                        checked={formData.active}
                        onCheckedChange={(checked) => setFormData({ ...formData, active: checked as boolean })}
                      />
                      <Label htmlFor="active">Active</Label>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="affiliateUrl">Affiliate URL</Label>
                <Textarea
                  id="affiliateUrl"
                  value={formData.affiliateUrl}
                  onChange={(e) => setFormData({ ...formData, affiliateUrl: e.target.value })}
                  placeholder="https://partner.com/booking-link"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Deal"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search deals by destination, country, or airline..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Deals</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="inactive">Inactive Only</SelectItem>
                <SelectItem value="featured">Featured Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedDeals.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">{selectedDeals.length} deal(s) selected</span>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={() => handleBulkAction("activate")}>
                  Activate
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction("deactivate")}>
                  Deactivate
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction("feature")}>
                  Feature
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="destructive">
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Selected Deals</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {selectedDeals.length} deal(s)? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleBulkAction("delete")}>Delete</AlertDialogAction>
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
          <CardTitle>All Deals ({filteredDeals.length})</CardTitle>
          <CardDescription>Manage and monitor your flight deals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">
                    <Checkbox
                      checked={selectedDeals.length === filteredDeals.length && filteredDeals.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="text-left p-2">Destination</th>
                  <th className="text-left p-2">Price</th>
                  <th className="text-left p-2">Airline</th>
                  <th className="text-left p-2">Dates</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeals.map((deal) => (
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
                        <div className="text-sm text-gray-600 dark:text-gray-400">{deal.country}</div>
                      </div>
                    </td>
                    <td className="p-2">
                      <div>
                        <div className="font-medium text-green-600">€{deal.current_price}</div>
                        <div className="text-sm text-gray-500 line-through">€{deal.original_price}</div>
                        <div className="text-xs text-blue-600">{deal.discount_percentage}% off</div>
                      </div>
                    </td>
                    <td className="p-2">{deal.airline}</td>
                    <td className="p-2">
                      <div className="text-sm">
                        <div>{deal.departure_date}</div>
                        <div className="text-gray-600 dark:text-gray-400">to {deal.return_date}</div>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex flex-col space-y-1">
                        <Badge variant={deal.is_active ? "default" : "secondary"}>
                          {deal.is_active ? "Active" : "Inactive"}
                        </Badge>
                        {deal.is_featured && <Badge variant="outline">Featured</Badge>}
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => handleEdit(deal)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Edit Deal</DialogTitle>
                              <DialogDescription>Update the deal information</DialogDescription>
                            </DialogHeader>
                            {editingDeal && (
                              <form onSubmit={handleFormSubmit} className="space-y-4">
                                {/* Same form fields as add dialog */}
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="edit-destination">Destination</Label>
                                    <Input
                                      id="edit-destination"
                                      value={formData.destination}
                                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                      required
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-country">Country</Label>
                                    <Input
                                      id="edit-country"
                                      value={formData.country}
                                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                      required
                                    />
                                  </div>
                                </div>
                                <div className="flex justify-end space-x-2">
                                  <Button type="button" variant="outline" onClick={() => setEditingDeal(null)}>
                                    Cancel
                                  </Button>
                                  <Button type="submit" disabled={submitting}>
                                    {submitting ? (
                                      <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Updating...
                                      </>
                                    ) : (
                                      "Update Deal"
                                    )}
                                  </Button>
                                </div>
                              </form>
                            )}
                          </DialogContent>
                        </Dialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Deal</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete the deal to {deal.destination}? This action cannot be
                                undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(deal.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
