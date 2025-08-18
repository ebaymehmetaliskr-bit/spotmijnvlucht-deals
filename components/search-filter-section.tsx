"use client"

import { useState } from "react"
import { Search, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SearchFilterProps {
  onSearch: (searchTerm: string) => void
  onPriceFilter: (minPrice: number, maxPrice: number) => void
  onAirlineFilter: (airlines: string[]) => void
  onDestinationFilter: (destinations: string[]) => void
  availableAirlines: string[]
  availableDestinations: string[]
  onClearFilters: () => void
}

export default function SearchFilterSection({
  onSearch,
  onPriceFilter,
  onAirlineFilter,
  onDestinationFilter,
  availableAirlines,
  availableDestinations,
  onClearFilters,
}: SearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500 })
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([])
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    onSearch(value)
  }

  const handlePriceChange = (type: "min" | "max", value: number) => {
    const newRange = { ...priceRange, [type]: value }
    setPriceRange(newRange)
    onPriceFilter(newRange.min, newRange.max)
  }

  const handleAirlineToggle = (airline: string) => {
    const newSelection = selectedAirlines.includes(airline)
      ? selectedAirlines.filter((a) => a !== airline)
      : [...selectedAirlines, airline]
    setSelectedAirlines(newSelection)
    onAirlineFilter(newSelection)
  }

  const handleDestinationToggle = (destination: string) => {
    const newSelection = selectedDestinations.includes(destination)
      ? selectedDestinations.filter((d) => d !== destination)
      : [...selectedDestinations, destination]
    setSelectedDestinations(newSelection)
    onDestinationFilter(newSelection)
  }

  const clearAllFilters = () => {
    setSearchTerm("")
    setPriceRange({ min: 0, max: 500 })
    setSelectedAirlines([])
    setSelectedDestinations([])
    onClearFilters()
  }

  const hasActiveFilters =
    searchTerm ||
    selectedAirlines.length > 0 ||
    selectedDestinations.length > 0 ||
    priceRange.min > 0 ||
    priceRange.max < 500

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      {/* Search Bar */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Zoek naar bestemming..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 h-12"
          />
        </div>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="h-12 px-6">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
        {hasActiveFilters && (
          <Button variant="outline" onClick={clearAllFilters} className="h-12 px-4 bg-transparent">
            <X className="h-4 w-4 mr-2" />
            Wissen
          </Button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Price Range */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Prijsbereik</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">Min prijs (€)</label>
                <Input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => handlePriceChange("min", Number.parseInt(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Max prijs (€)</label>
                <Input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => handlePriceChange("max", Number.parseInt(e.target.value) || 500)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Airlines */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Luchtvaartmaatschappij</h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {availableAirlines.map((airline) => (
                <label key={airline} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedAirlines.includes(airline)}
                    onChange={() => handleAirlineToggle(airline)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">{airline}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Destinations */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Bestemmingen</h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {availableDestinations.map((destination) => (
                <label key={destination} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedDestinations.includes(destination)}
                    onChange={() => handleDestinationToggle(destination)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">{destination}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
