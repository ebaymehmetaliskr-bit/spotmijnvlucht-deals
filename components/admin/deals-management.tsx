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
import type { AdminDealRecord, DealUpsertRequest } from "@/lib/types/deals"

type Deal = AdminDealRecord

interface DealFormState {
  destination: string
  country: string
  origin: string
  currentPrice: string
  originalPrice: string
  airline: string
  departureDate: string
  returnDate: string
  expirationDate: string
  seatsAvailable: string
  affiliateUrl: string
  featured: boolean
  active: boolean
}

const defaultFormState: DealFormState = {
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
}

function createDefaultFormState(): DealFormState {
  return { ...defaultFormState }
}

function toFormDate(value?: string | null) {
  if (!value) {
    return ""
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return ""
  }

  return date.toISOString().split("T")[0] ?? ""
}

function parseNumber(value: string) {
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function parseInteger(value: string) {
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) ? parsed : 0
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
  const [formData, setFormData] = useState<DealFormState>(() => createDefaultFormState())

  useEffect(() => {
    fetchDeals()
  }, [])

  const fetchDeals = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/deals", { cache: "no-store" })
      let payload: unknown = null

      try {
        payload = await response.json()
      } catch (error) {
        payload = null
      }

      if (!response.ok) {
        const message =
          (payload && typeof (payload as any).error === "string" && (payload as any).error) ||
          "Failed to fetch deals"
        toast.error(message)
        return
      }

      if (Array.isArray(payload)) {
        setDeals(payload as Deal[])
        setSelectedDeals([])
      } else {
        console.warn("Unexpected admin deals payload", payload)
        setDeals([])
        toast.error("Ongeldig antwoord van de deals API")
      }
    } catch (error) {
      console.error("Error fetching deals:", error)
      toast.error("Failed to fetch deals")
    } finally {
      setLoading(false)
    }
  }

  const filteredDeals = deals.filter((deal) => {
    const destination = (deal.destination || "").toLowerCase()
    const country = (deal.country || "").toLowerCase()
    const airline = (deal.airline || "").toLowerCase()
    const normalizedSearch = searchTerm.toLowerCase().trim()

    const matchesSearch =
      normalizedSearch.length === 0 ||
      destination.includes(normalizedSearch) ||
      country.includes(normalizedSearch) ||
      airline.includes(normalizedSearch)

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "active" && (deal.is_active ?? true)) ||
      (filterStatus === "inactive" && !(deal.is_active ?? true)) ||
      (filterStatus === "featured" && Boolean(deal.is_featured))

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
      const trimmedOrigin = formData.origin.trim()
      const trimmedAffiliateUrl = formData.affiliateUrl.trim()

      const payload: DealUpsertRequest = {
        destination: formData.destination.trim(),
        country: formData.country.trim(),
        origin: trimmedOrigin || undefined,
        currentPrice: parseNumber(formData.currentPrice),
        originalPrice: parseNumber(formData.originalPrice),
        airline: formData.airline.trim(),
        departureDate: formData.departureDate || undefined,
        returnDate: formData.returnDate || undefined,
        expirationDate: formData.expirationDate || undefined,
        seatsAvailable: parseInteger(formData.seatsAvailable),
        affiliateUrl: trimmedAffiliateUrl || undefined,
        featured: formData.featured,
        active: formData.active,
      }

      if (editingDeal) {
        const response = await fetch(`/api/admin/deals/${editingDeal.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })

        const result = await response.json().catch(() => null)
        if (!response.ok) {
          const message =
            (result && typeof (result as any).error === "string" && (result as any).error) ||
            "Failed to update deal"
          toast.error(message)
          return
        }

        toast.success("Deal updated successfully!")
        setEditingDeal(null)
        await fetchDeals()
      } else {
        const response = await fetch("/api/admin/deals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })

        const result = await response.json().catch(() => null)
        if (!response.ok) {
          const message =
            (result && typeof (result as any).error === "string" && (result as any).error) ||
            "Failed to add deal"
          toast.error(message)
          return
        }

        toast.success("Deal added successfully!")
        setIsAddDialogOpen(false)
        await fetchDeals()
      }

      setFormData(createDefaultFormState())
    } catch (error) {
      console.error("Error saving deal:", error)
      toast.error("Failed to save deal")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (deal: Deal) => {
    setEditingDeal(deal)
    setIsAddDialogOpen(false)
    setFormData({
      destination: deal.destination || "",
      country: deal.country || "",
      origin: deal.origin || defaultFormState.origin,
      currentPrice: (deal.current_price ?? 0).toString(),
      originalPrice: (deal.original_price ?? 0).toString(),
      airline: deal.airline || "",
      departureDate: toFormDate(deal.departure_date),
      returnDate: toFormDate(deal.return_date),
      expirationDate: toFormDate(deal.deal_expiration),
      seatsAvailable: (deal.seats_available ?? 0).toString(),
      affiliateUrl: deal.affiliate_url || "",
      featured: Boolean(deal.is_featured),
      active: deal.is_active ?? true,
    })
  }

  const handleDelete = async (dealId: string) => {
    try {
      const response = await fetch(`/api/admin/deals/${dealId}`, {
        method: "DELETE",
      })

      const result = await response.json().catch(() => null)

      if (!response.ok) {
        const message =
          (result && typeof (result as any).error === "string" && (result as any).error) ||
          "Failed to delete deal"
        toast.error(message)
        return
      }

      toast.success("Deal deleted successfully!")
      await fetchDeals()
    } catch (error) {
      console.error("Error deleting deal:", error)
      toast.error("Failed to delete deal")
    }
  }

  const handleBulkAction = async (action: string) => {
    if (selectedDeals.length === 0) {
      return
    }

    try {
      await Promise.all(
        selectedDeals.map(async (dealId) => {
          if (action === "delete") {
            const response = await fetch(`/api/admin/deals/${dealId}`, { method: "DELETE" })
            if (!response.ok) {
              const result = await response.json().catch(() => null)
              const message =
                (result && typeof (result as any).error === "string" && (result as any).error) ||
                "Failed to delete deal"
              throw new Error(message)
            }
            return
          }

          let payload: Partial<DealUpsertRequest> | null = null
          switch (action) {
            case "activate":
              payload = { active: true }
              break
            case "deactivate":
              payload = { active: false }
              break
            case "feature":
              payload = { featured: true }
              break
            default:
              payload = null
          }

          if (!payload) {
            return
          }

          const response = await fetch(`/api/admin/deals/${dealId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })

          if (!response.ok) {
            const result = await response.json().catch(() => null)
            const message =
              (result && typeof (result as any).error === "string" && (result as any).error) ||
              "Failed to update deal"
            throw new Error(message)
          }
        }),
      )

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
      const message = error instanceof Error ? error.message : "Failed to perform bulk action"
      toast.error(message)
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
                {filteredDeals.map((deal) => {
                  const currentPrice = Number.isFinite(deal.current_price) ? deal.current_price : 0
                  const originalPrice = Number.isFinite(deal.original_price) ? deal.original_price : currentPrice
                  const discount = Number.isFinite(deal.discount_percentage)
                    ? Math.max(0, Math.round(deal.discount_percentage))
                    : Math.max(0, Math.round(originalPrice > 0 ? ((originalPrice - currentPrice) / originalPrice) * 100 : 0))
                  const departureDisplay = toFormDate(deal.departure_date) || "N.t.b."
                  const returnDisplay = toFormDate(deal.return_date)

                  return (
                    <tr key={deal.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="p-2">
                        <Checkbox
                          checked={selectedDeals.includes(deal.id)}
                          onCheckedChange={(checked) => handleSelectDeal(deal.id, checked as boolean)}
                        />
                      </td>
                      <td className="p-2">
                        <div>
                          <div className="font-medium">{deal.destination || "Onbekende bestemming"}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{deal.country || ""}</div>
                        </div>
                      </td>
                      <td className="p-2">
                        <div>
                          <div className="font-medium text-green-600">€{currentPrice}</div>
                          <div className="text-sm text-gray-500 line-through">€{originalPrice}</div>
                          <div className="text-xs text-blue-600">{discount}% off</div>
                        </div>
                      </td>
                      <td className="p-2">{deal.airline || "Onbekend"}</td>
                      <td className="p-2">
                        <div className="text-sm">
                          <div>{departureDisplay}</div>
                          <div className="text-gray-600 dark:text-gray-400">
                            {returnDisplay ? `tot ${returnDisplay}` : "Geen retourdatum"}
                          </div>
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
                                  Are you sure you want to delete the deal to {deal.destination || "deze bestemming"}? This
                                  action cannot be undone.
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
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
