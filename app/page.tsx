// app/page.tsx
"use client"

import { useEffect, useMemo, useState } from "react"

import Footer from "@/components/footer"
import Header from "@/components/header"
import EnhancedDealCard from "@/components/enhanced-deal-card"
import PartnerBrandingFooter from "@/components/partner-branding-footer"
import DealOfTheDaySection from "@/components/deal-of-the-day-section"
import NewsletterSection from "@/components/newsletter-section"
import SearchFilterSection from "@/components/search-filter-section"
import TestimonialsSection from "@/components/testimonials-section"
import type { AffiliatePartnerKey, NormalizedDeal } from "@/lib/deals"
import { FALLBACK_DEAL } from "@/lib/deals"

interface DealCardData {
  id: number
  origin?: string
  destination: string
  country: string
  originalPrice: number
  currentPrice: number
  discount: number
  airline: string
  seatsRemaining: number
  image: string
  airlineLogo: string
  expiresAt: Date
  partner?: AffiliatePartnerKey
  rating?: number
  reviewCount?: number
  competitorPrice?: number
  bookingsToday?: number
  link?: string
  isFeatured?: boolean
  isDealOfDay?: boolean
}

function parseDate(value?: string) {
  if (!value) {
    return new Date(Date.now() + 36 * 60 * 60 * 1000)
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return new Date(Date.now() + 36 * 60 * 60 * 1000)
  }

  return date
}

function mapDealToCardData(deal: NormalizedDeal): DealCardData {
  const expiresAt = parseDate(deal.dealExpiresAt)
  const currentPrice = deal.currentPrice > 0 ? deal.currentPrice : deal.originalPrice
  const originalPrice = deal.originalPrice > currentPrice ? deal.originalPrice : currentPrice
  const discount =
    deal.discountPercentage > 0
      ? Math.round(deal.discountPercentage)
      : originalPrice > 0
        ? Math.max(Math.round(((originalPrice - currentPrice) / originalPrice) * 100), 0)
        : 0

  return {
    id: deal.id,
    origin: deal.origin,
    destination: deal.destination,
    country: deal.country,
    originalPrice,
    currentPrice,
    discount,
    airline: deal.airline,
    seatsRemaining: deal.seatsRemaining > 0 ? deal.seatsRemaining : 6,
    image: deal.imageUrl || "/placeholder.svg",
    airlineLogo: deal.airlineLogoUrl || "/placeholder.svg",
    expiresAt,
    partner: deal.partner,
    rating: deal.rating,
    reviewCount: deal.reviewCount,
    competitorPrice: deal.competitorPrice,
    bookingsToday: deal.dailyBookings,
    link: deal.link,
    isFeatured: deal.isFeatured,
    isDealOfDay: deal.isDealOfDay,
  }
}

const FALLBACK_CARD = mapDealToCardData(FALLBACK_DEAL)

export default function HomePage() {
  const [deals, setDeals] = useState<DealCardData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function fetchDeals() {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch("/api/deals", {
          headers: { Accept: "application/json" },
          cache: "no-store",
        })

        if (!response.ok) {
          throw new Error(`Deals konden niet worden geladen (status ${response.status}).`)
        }

        const payload = await response.json()
        const normalized: NormalizedDeal[] = Array.isArray(payload) ? payload : payload.items ?? []

        const mappedDeals = normalized
          .map(mapDealToCardData)
          .filter((deal): deal is DealCardData => Boolean(deal))

        if (!isMounted) {
          return
        }

        setDeals(mappedDeals)
      } catch (err) {
        console.error("Failed to fetch deals:", err)
        if (!isMounted) {
          return
        }
        const message = err instanceof Error ? err.message : "Onbekende fout bij het ophalen van deals."
        setError(message)
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

  const heroDeal = useMemo(() => {
    if (deals.length === 0) {
      return FALLBACK_CARD
    }

    return deals.find((deal) => deal.isDealOfDay) ?? deals.find((deal) => deal.isFeatured) ?? deals[0]
  }, [deals])

  const visibleDeals = deals.length > 0 ? deals : [FALLBACK_CARD]

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main>
        <SearchFilterSection />
        {heroDeal && <DealOfTheDaySection deal={heroDeal} />}
        <section className="container mx-auto px-4 md:px-8 py-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Populaire Vliegdeals</h2>
          {isLoading && <p className="text-center py-10">Deals worden geladen...</p>}
          {error && (
            <p className="text-center text-red-500 py-6">
              {error}
              <br />
              We tonen een voorbeelddeal zolang er geen live data beschikbaar is.
            </p>
          )}
          {!isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {visibleDeals.length > 0 ? (
                visibleDeals.map((deal) => <EnhancedDealCard key={`${deal.id}-${deal.destination}`} deal={deal} />)
              ) : (
                <p className="col-span-full text-center py-10">Geen passende deals gevonden.</p>
              )}
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
