import { AFFILIATE_PARTNERS } from "@/lib/affiliate-tracking"

export const DEFAULT_DEALS_API_BASE_URL =
  "https://spotmijnvlucht-api-778985017095.europe-west1.run.app"

export type AffiliatePartnerKey = keyof typeof AFFILIATE_PARTNERS

export interface NormalizedDeal {
  id: number
  externalId?: string
  origin: string
  destination: string
  country: string
  currentPrice: number
  originalPrice: number
  discountPercentage: number
  airline: string
  airlineLogoUrl: string
  imageUrl: string
  departureDate?: string
  returnDate?: string
  seatsRemaining: number
  dealExpiresAt: string
  rating?: number
  reviewCount?: number
  competitorPrice?: number
  dailyBookings?: number
  partner: AffiliatePartnerKey
  link?: string
  isFeatured: boolean
  isDealOfDay: boolean
}

function parseString(value: unknown, fallback = ""): string {
  if (typeof value === "string") {
    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : fallback
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value.toString() : fallback
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false"
  }

  return fallback
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : fallback
  }

  if (typeof value === "string") {
    const sanitized = value.replace(/[^0-9.,-]/g, "").replace(",", ".")
    const parsed = Number.parseFloat(sanitized)
    return Number.isFinite(parsed) ? parsed : fallback
  }

  return fallback
}

function parseDateToIso(value: unknown): string | undefined {
  if (!value) {
    return undefined
  }

  const date = value instanceof Date ? value : new Date(value as string)

  if (Number.isNaN(date.getTime())) {
    return undefined
  }

  return date.toISOString()
}

function ensureFutureDate(value?: string): string {
  if (value) {
    const date = new Date(value)
    if (!Number.isNaN(date.getTime())) {
      return date.toISOString()
    }
  }

  const fallbackDate = new Date()
  fallbackDate.setHours(fallbackDate.getHours() + 36)
  return fallbackDate.toISOString()
}

function fallbackImageFor(destination: string): string {
  const keyword = destination ? encodeURIComponent(destination) : "travel"
  return `https://source.unsplash.com/800x600/?${keyword},city,skyline`
}

function fallbackAirlineLogo(): string {
  return "/placeholder.svg"
}

function deriveDiscount(originalPrice: number, currentPrice: number): number {
  if (originalPrice <= 0 || currentPrice <= 0 || currentPrice >= originalPrice) {
    return 0
  }

  return Math.max(Math.round(((originalPrice - currentPrice) / originalPrice) * 100), 0)
}

function normalizePartner(rawPartner: unknown): AffiliatePartnerKey {
  const partnerKey = parseString(rawPartner).toLowerCase()

  if (partnerKey && partnerKey in AFFILIATE_PARTNERS) {
    return partnerKey as AffiliatePartnerKey
  }

  return "booking"
}

export function extractDealsFromPayload(payload: unknown): unknown[] {
  if (!payload) {
    return []
  }

  if (Array.isArray(payload)) {
    return payload
  }

  if (typeof payload === "object") {
    const record = payload as Record<string, unknown>

    if (Array.isArray(record.items)) {
      return record.items
    }

    if (Array.isArray(record.deals)) {
      return record.deals
    }

    if (Array.isArray(record.data)) {
      return record.data
    }

    if (Array.isArray(record.results)) {
      return record.results
    }
  }

  return []
}

export function normalizeDeal(rawDeal: unknown, index = 0): NormalizedDeal | null {
  if (!rawDeal || typeof rawDeal !== "object") {
    return null
  }

  const record = rawDeal as Record<string, unknown>

  const destination = parseString(
    record.destination ?? record.city_name ?? record.city ?? record.to ?? "Onbekende bestemming",
  )
  const country = parseString(record.country ?? record.country_name ?? "Nederland")
  const airline = parseString(record.airline ?? record.airline_name ?? record.carrier ?? "Onbekende maatschappij")

  const currentPrice = toNumber(record.current_price ?? record.price ?? record.currentPrice ?? 0)
  const originalCandidate = toNumber(
    record.original_price ?? record.originalPrice ?? record.previous_price ?? record.originalFare ?? 0,
  )

  const originalPrice = originalCandidate > currentPrice && originalCandidate > 0 ? originalCandidate : currentPrice
  const discountRaw = toNumber(record.discount_percentage ?? record.discount ?? record.discountPercent ?? 0)
  const discountPercentage = discountRaw > 0 ? discountRaw : deriveDiscount(originalPrice, currentPrice)

  const seats = toNumber(
    record.seats_remaining ?? record.seats_available ?? record.available_seats ?? record.seats ?? 0,
    0,
  )
  const seatsRemaining = seats > 0 ? Math.round(seats) : 6

  const dealExpiresAt = ensureFutureDate(
    parseDateToIso(
      record.deal_expires_at ?? record.expiration_date ?? record.deal_expiration ?? record.expires_at ?? record.expiresAt,
    ),
  )

  const departureDate = parseDateToIso(record.departure_date ?? record.depart_date ?? record.depart_at ?? record.departure_at)
  const returnDate = parseDateToIso(record.return_date ?? record.return_at ?? record.returnDate)

  const imageUrl = parseString(
    record.image_url ?? record.image ?? record.imageUrl ?? record.destination_image_url ?? fallbackImageFor(destination),
  )

  const airlineLogoUrl = parseString(
    record.airline_logo ?? record.airline_logo_url ?? record.airlineLogo ?? fallbackAirlineLogo(),
  )

  const rating = toNumber(record.rating, 0)
  const reviewCount = toNumber(record.review_count ?? record.reviews ?? record.reviewCount, 0)
  const competitorPrice = toNumber(record.competitor_price ?? record.competitorPrice, 0)
  const dailyBookings = toNumber(record.daily_bookings ?? record.bookings_today ?? record.booking_count, 0)

  const partner = normalizePartner(record.partner_id ?? record.partner ?? record.partnerKey ?? record.affiliate_partner)

  const link = parseString(record.link ?? record.url ?? record.booking_url ?? record.deep_link ?? "")

  const idValue = record.id ?? record.uuid ?? record.external_id
  const numericId = Number.parseInt(parseString(idValue), 10)
  const id = Number.isFinite(numericId) ? numericId : index + 1
  const externalId = Number.isFinite(numericId) ? undefined : parseString(idValue || `deal-${index + 1}`)

  return {
    id,
    externalId,
    origin: parseString(record.origin ?? record.from ?? record.origin_city ?? record.origin_airport ?? ""),
    destination,
    country,
    currentPrice,
    originalPrice,
    discountPercentage,
    airline,
    airlineLogoUrl: airlineLogoUrl || fallbackAirlineLogo(),
    imageUrl: imageUrl || fallbackImageFor(destination),
    departureDate: departureDate,
    returnDate: returnDate,
    seatsRemaining,
    dealExpiresAt,
    rating: rating > 0 ? Number(rating.toFixed(1)) : undefined,
    reviewCount: reviewCount > 0 ? Math.round(reviewCount) : undefined,
    competitorPrice: competitorPrice > 0 ? competitorPrice : undefined,
    dailyBookings: dailyBookings > 0 ? Math.round(dailyBookings) : undefined,
    partner,
    link: link || undefined,
    isFeatured: Boolean(record.is_featured ?? record.featured ?? record.isFeatured),
    isDealOfDay: Boolean(record.is_deal_of_day ?? record.deal_of_day ?? record.dealOfDay),
  }
}

export function normalizeDealsFromPayload(payload: unknown): NormalizedDeal[] {
  return extractDealsFromPayload(payload)
    .map((deal, index) => normalizeDeal(deal, index))
    .filter((deal): deal is NormalizedDeal => Boolean(deal))
}

const departureFallback = new Date()
departureFallback.setDate(departureFallback.getDate() + 7)

const returnFallback = new Date()
returnFallback.setDate(returnFallback.getDate() + 14)

const expiresFallback = new Date()
expiresFallback.setHours(expiresFallback.getHours() + 24)

export const FALLBACK_DEAL: NormalizedDeal = {
  id: 1,
  externalId: "fallback-1",
  origin: "Amsterdam (AMS)",
  destination: "Barcelona",
  country: "Spanje",
  currentPrice: 199,
  originalPrice: 299,
  discountPercentage: 33,
  airline: "KLM",
  airlineLogoUrl: "/klm-logo.png",
  imageUrl: "/barcelona-sagrada-familia-park-guell.png",
  departureDate: departureFallback.toISOString(),
  returnDate: returnFallback.toISOString(),
  seatsRemaining: 5,
  dealExpiresAt: expiresFallback.toISOString(),
  rating: 4.8,
  reviewCount: 182,
  competitorPrice: 249,
  dailyBookings: 32,
  partner: "booking",
  link: "https://www.klm.com",
  isFeatured: true,
  isDealOfDay: true,
}
