'use client'

import { useCallback, useEffect, useMemo, useState } from "react"
import Footer from "@/components/footer"
import Header from "@/components/header"
import SearchFilterSection from "@/components/search-filter-section"
import TestimonialsSection from "@/components/testimonials-section"
import NewsletterSection from "@/components/newsletter-section"
import EnhancedDealCard, { type EnhancedDealCardData } from "@/components/enhanced-deal-card"
import PartnerBrandingFooter from "@/components/partner-branding-footer"
import DealOfTheDaySection, { type DealOfTheDayDeal } from "@/components/deal-of-the-day-section"
import { AFFILIATE_PARTNERS } from "@/lib/affiliate-tracking"
import type { DealsApiResponse, NormalizedDeal } from "@/lib/types/deals"
import { getSampleDeals } from "@/lib/sample-deals"

const placeholderImage = "/placeholder.jpg"
const placeholderAirlineLogo = "/placeholder-logo.png"

const airlineLogos: Record<string, string> = {
  "klm": "/klm-logo.png",
  "turkish airlines": "/turkish-airlines-logo.png",
  "british airways": "/british-airways-logo.png",
  "delta airlines": "/delta-airlines-logo.png",
  "ita airways": "/ita-airways-logo.png",
  "japan airlines": "/japan-airlines-logo.png",
  "czech airlines": "/czech-airlines-logo.png",
  "vueling": "/vueling-logo.png",
}

const destinationImages: Record<string, string> = {
  "barcelona": "/barcelona-sagrada-familia-park-guell.png",
  "istanbul": "/istanbul-hagia-sophia-bosphorus.png",
  "rome": "/rome-colosseum-vatican.png",
  "paris": "/paris-eiffel-tower.png",
  "london": "/london-big-ben-tower-bridge.png",
  "new york": "/new-york-city-skyline.png",
  "prague": "/prague-castle-charles-bridge.png",
  "tokyo": "/tokyo-fuji-skyline.png",
  "amsterdam": "/amsterdam-canals-tulips.png",
}

const sampleDeals = getSampleDeals()

type PartnerKey = keyof typeof AFFILIATE_PARTNERS

function parseDate(value?: string) {
  if (!value) {
    return new Date(Date.now() + 72 * 60 * 60 * 1000)
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return new Date(Date.now() + 72 * 60 * 60 * 1000)
  }

  return date
}

function safeNumber(value: number | undefined, fallback: number) {
  if (value === null || value === undefined) {
    return fallback
  }

  const parsed = Number(value)
  if (!Number.isFinite(parsed)) {
    return fallback
  }

  return parsed
}

function safePrice(value: number | undefined, fallback: number) {
  return Math.max(0, Math.round(safeNumber(value, fallback)))
}

function safeInteger(value: number | undefined, fallback: number) {
  return Math.max(0, Math.round(safeNumber(value, fallback)))
}

function getAirlineLogo(airline?: string) {
  if (!airline) {
    return placeholderAirlineLogo
  }

  const normalized = airline.toLowerCase()
  const match = Object.entries(airlineLogos).find(([key]) => key === normalized)
  return match ? match[1] : placeholderAirlineLogo
}

function getDestinationImage(destination?: string) {
  if (!destination) {
    return placeholderImage
  }

  const normalized = destination.toLowerCase()
  const match = Object.entries(destinationImages).find(([key]) => key === normalized)
  if (match) {
    return match[1]
  }

  return `https://source.unsplash.com/640x480/?${encodeURIComponent(destination)}%20travel`
}

function resolvePartnerKey(partner?: string): PartnerKey {
  if (!partner) {
    return "booking"
  }

  const normalized = partner.toLowerCase()
  const availablePartners = Object.keys(AFFILIATE_PARTNERS) as PartnerKey[]
  const match = availablePartners.find((key) => key.toLowerCase() === normalized)
  return match ?? "booking"
}

function toEnhancedDeal(deal: NormalizedDeal, index: number): EnhancedDealCardData {
  const currentPrice = safePrice(deal.currentPrice, 0)
  const computedOriginalFallback = currentPrice > 0 ? Math.round(currentPrice * 1.2) : currentPrice
  const originalPrice = safePrice(deal.originalPrice, computedOriginalFallback)

  const discount =
    deal.discountPercentage !== undefined && Number.isFinite(deal.discountPercentage)
      ? Math.max(0, Math.round(deal.discountPercentage))
      : originalPrice > 0
        ? Math.max(0, Math.round(((originalPrice - currentPrice) / originalPrice) * 100))
        : 0

  const seatsRemaining = Math.max(1, safeInteger(deal.seatsAvailable, 6) || 6)
  const rating = deal.rating ?? 4.6
  const reviewCount = deal.reviewCount ?? Math.floor(Math.random() * 220 + 60)
  const competitorPrice =
    deal.competitorPrice !== undefined ? deal.competitorPrice : originalPrice + Math.round(originalPrice * 0.08)
  const bookingsToday = deal.bookingsToday ?? Math.floor(Math.random() * 35 + 12)

  const numericId = Number.parseInt(deal.id, 10)
  const id = Number.isFinite(numericId) ? numericId : index + 1

  return {
    id,
    destination: deal.destination,
    country: deal.country,
    originalPrice,
    currentPrice,
    discount,
    airline: deal.airline ?? "Onbekende maatschappij",
    seatsRemaining,
    image: deal.imageUrl || getDestinationImage(deal.destination),
    airlineLogo: deal.airlineLogoUrl || getAirlineLogo(deal.airline),
    expiresAt: parseDate(deal.dealExpiration || deal.expiresAt),
    partner: resolvePartnerKey(deal.partner),
    rating,
    reviewCount,
    competitorPrice,
    bookingsToday,
  }
}

function toDealOfTheDay(deal: NormalizedDeal, index: number): DealOfTheDayDeal {
  const enhanced = toEnhancedDeal(deal, index)

  return {
    id: enhanced.id,
    destination: enhanced.destination,
    country: enhanced.country,
    originalPrice: enhanced.originalPrice,
    currentPrice: enhanced.currentPrice,
    discount: enhanced.discount,
    airline: enhanced.airline,
    seatsRemaining: enhanced.seatsRemaining,
    image: enhanced.image,
    airlineLogo: enhanced.airlineLogo,
    expiresAt: enhanced.expiresAt,
  }
}

export default function HomePage() {
  const [deals, setDeals] = useState<NormalizedDeal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usedFallback, setUsedFallback] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [priceFilter, setPriceFilter] = useState<[number, number] | null>(null)
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([])
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([])

  useEffect(() => {
    let isMounted = true

    async function fetchDeals() {
      try {
        setIsLoading(true)
        setError(null)
        setUsedFallback(false)

        const response = await fetch("/api/deals")
        if (!response.ok) {
          throw new Error("Deals konden niet worden geladen.")
        }

        const data = (await response.json()) as DealsApiResponse
        if (!isMounted) {
          return
        }

        setDeals(Array.isArray(data.items) ? data.items : [])
        setUsedFallback(Boolean(data.fallback))

        if (data.error) {
          setError(data.error)
        }
      } catch (err) {
        console.error("Failed to fetch deals", err)
        if (!isMounted) {
          return
        }

        const message = err instanceof Error ? err.message : "Onbekende fout"
        setError(message)
        setDeals(sampleDeals)
        setUsedFallback(true)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchDeals()

    return () => {
      isMounted = false
    }
  }, [])

  const availableAirlines = useMemo(() => {
    const airlines = new Set<string>()
    deals.forEach((deal) => {
      if (deal.airline) {
        airlines.add(deal.airline)
      }
    })
    return Array.from(airlines).sort((a, b) => a.localeCompare(b))
  }, [deals])

  const availableDestinations = useMemo(() => {
    const destinations = new Set<string>()
    deals.forEach((deal) => {
      const label = deal.destinationCity || deal.destination
      if (label) {
        destinations.add(label)
      }
    })
    return Array.from(destinations).sort((a, b) => a.localeCompare(b))
  }, [deals])

  const filteredDeals = useMemo(() => {
    const [minPrice, maxPrice] = priceFilter ? priceFilter : [0, Infinity]
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return deals.filter((deal) => {
      const price = safeNumber(deal.currentPrice, 0)
      const matchesPrice = price >= minPrice && price <= maxPrice

      const matchesAirline =
        selectedAirlines.length === 0 ||
        (deal.airline && selectedAirlines.includes(deal.airline))

      const destinationLabel = (deal.destinationCity || deal.destination || "").toLowerCase()
      const matchesDestination =
        selectedDestinations.length === 0 ||
        selectedDestinations.some((destination) => destination.toLowerCase() === destinationLabel)

      const matchesSearch =
        normalizedSearch.length === 0 ||
        [deal.destination, deal.destinationCity, deal.country, deal.airline]
          .filter(Boolean)
          .some((field) => field!.toLowerCase().includes(normalizedSearch))

      return matchesPrice && matchesAirline && matchesDestination && matchesSearch
    })
  }, [deals, priceFilter, searchTerm, selectedAirlines, selectedDestinations])

  const enhancedDeals = useMemo(
    () => filteredDeals.map((deal, index) => toEnhancedDeal(deal, index)),
    [filteredDeals],
  )

  const dealOfTheDaySource = useMemo(() => {
    if (deals.length === 0) {
      return null
    }

    return deals.find((deal) => deal.isDealOfDay) || deals.find((deal) => deal.isFeatured) || deals[0]
  }, [deals])

  const dealOfTheDay = useMemo(() => {
    if (dealOfTheDaySource) {
      const index = deals.findIndex((deal) => deal.id === dealOfTheDaySource.id)
      return toDealOfTheDay(dealOfTheDaySource, index >= 0 ? index : 0)
    }

    return toDealOfTheDay(sampleDeals[0], 0)
  }, [dealOfTheDaySource, deals])

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value)
  }, [])

  const handlePriceFilter = useCallback((min: number, max: number) => {
    const sanitizedMin = min > 0 ? min : 0
    const sanitizedMax = max > 0 ? max : Infinity

    if (sanitizedMin === 0 && sanitizedMax === Infinity) {
      setPriceFilter(null)
    } else {
      setPriceFilter([sanitizedMin, sanitizedMax])
    }
  }, [])

  const handleAirlineFilter = useCallback((airlines: string[]) => {
    setSelectedAirlines(airlines)
  }, [])

  const handleDestinationFilter = useCallback((destinations: string[]) => {
    setSelectedDestinations(destinations)
  }, [])

  const handleClearFilters = useCallback(() => {
    setSearchTerm("")
    setPriceFilter(null)
    setSelectedAirlines([])
    setSelectedDestinations([])
  }, [])

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main>
        <section className="bg-white">
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 space-y-10">
            <SearchFilterSection
              onSearch={handleSearch}
              onPriceFilter={handlePriceFilter}
              onAirlineFilter={handleAirlineFilter}
              onDestinationFilter={handleDestinationFilter}
              availableAirlines={availableAirlines}
              availableDestinations={availableDestinations}
              onClearFilters={handleClearFilters}
            />
            <DealOfTheDaySection deal={dealOfTheDay} />
          </div>
        </section>

        <section id="deals" className="max-w-6xl mx-auto px-4 md:px-8 py-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Populaire Vliegdeals</h2>
            <p className="text-gray-600 mt-2">Ontdek de beste aanbiedingen die we vandaag voor je vonden.</p>
            {usedFallback && (
              <p className="mt-3 text-sm text-amber-600">
                Er was een probleem met de live-data, daarom tonen we tijdelijk voorbeelddeals.
              </p>
            )}
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>

          {isLoading ? (
            <p className="text-center py-10 text-gray-600">Deals worden geladen...</p>
          ) : enhancedDeals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {enhancedDeals.map((deal) => (
                <EnhancedDealCard key={`${deal.id}-${deal.destination}`} deal={deal} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Geen deals gevonden</h3>
              <p className="text-gray-600">Pas je filters aan of probeer een andere bestemming.</p>
            </div>
          )}
        </section>

        <TestimonialsSection />
        <NewsletterSection />
        <PartnerBrandingFooter />
      </main>
      <Footer />
    </div>
  )
}
