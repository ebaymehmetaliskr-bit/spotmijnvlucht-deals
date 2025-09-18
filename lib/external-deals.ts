import { getSampleDeals } from "@/lib/sample-deals"
import type { AdminDealRecord, DealUpsertRequest, NormalizedDeal } from "@/lib/types/deals"

const DEFAULT_API_BASE_URL = "https://spotmijnvlucht-api-778985017095.europe-west1.run.app"

const API_BASE_URL = (process.env.FLIGHT_DEALS_API_URL || DEFAULT_API_BASE_URL).replace(/\/$/, "")
const PUBLIC_API_KEY = process.env.FLIGHT_DEALS_API_KEY
const ADMIN_API_KEY = process.env.FLIGHT_DEALS_API_ADMIN_KEY || PUBLIC_API_KEY

export class ExternalApiError extends Error {
  status: number
  details?: string

  constructor(message: string, status: number, details?: string) {
    super(message)
    this.name = "ExternalApiError"
    this.status = status
    this.details = details
  }
}

interface ExternalRequestOptions extends RequestInit {
  useAdminKey?: boolean
}

function buildUrl(path: string) {
  if (!path.startsWith("/")) {
    return `${API_BASE_URL}/${path}`
  }
  return `${API_BASE_URL}${path}`
}

function buildHeaders(initHeaders: HeadersInit | undefined, {
  useAdminKey,
  hasBody,
}: {
  useAdminKey: boolean
  hasBody: boolean
}) {
  const headers = new Headers(initHeaders || {})

  if (hasBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json")
  }

  const apiKey = useAdminKey ? ADMIN_API_KEY : PUBLIC_API_KEY
  if (apiKey && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${apiKey}`)
  }

  return headers
}

async function externalFetch(path: string, options: ExternalRequestOptions = {}) {
  const { useAdminKey = false, ...init } = options
  const headers = buildHeaders(init.headers, { useAdminKey, hasBody: Boolean(init.body) })

  const response = await fetch(buildUrl(path), {
    ...init,
    headers,
    cache: "no-store",
  })

  if (!response.ok) {
    const details = await response.text().catch(() => undefined)
    throw new ExternalApiError(
      `External API request failed with status ${response.status}`,
      response.status,
      details,
    )
  }

  return response
}

async function externalJson<T>(path: string, options: ExternalRequestOptions = {}): Promise<T> {
  const response = await externalFetch(path, options)
  const text = await response.text()

  if (!text) {
    return {} as T
  }

  try {
    return JSON.parse(text) as T
  } catch (error) {
    throw new ExternalApiError("Failed to parse JSON response from external API", response.status, text)
  }
}

function toNumber(value: unknown): number | undefined {
  if (value === null || value === undefined || value === "") {
    return undefined
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

function toBoolean(value: unknown): boolean | undefined {
  if (value === null || value === undefined) {
    return undefined
  }

  if (typeof value === "boolean") {
    return value
  }

  if (typeof value === "number") {
    return value !== 0
  }

  if (typeof value === "string") {
    const normalized = value.toLowerCase()
    if (["true", "1", "yes", "y"].includes(normalized)) {
      return true
    }
    if (["false", "0", "no", "n"].includes(normalized)) {
      return false
    }
  }

  return undefined
}

function toStringValue(value: unknown): string | undefined {
  if (value === null || value === undefined) {
    return undefined
  }

  if (typeof value === "string") {
    return value
  }

  if (typeof value === "number" || value instanceof Date) {
    return String(value)
  }

  return undefined
}

function toIsoString(value: unknown): string | undefined {
  const stringValue = toStringValue(value)
  if (!stringValue) {
    return undefined
  }

  const date = new Date(stringValue)
  if (Number.isNaN(date.getTime())) {
    return undefined
  }

  return date.toISOString()
}

function extractDealsArray(payload: any): any[] {
  if (!payload) {
    return []
  }

  if (Array.isArray(payload)) {
    return payload
  }

  if (Array.isArray(payload?.items)) {
    return payload.items
  }

  if (Array.isArray(payload?.data)) {
    return payload.data
  }

  if (Array.isArray(payload?.results)) {
    return payload.results
  }

  if (Array.isArray(payload?.deals)) {
    return payload.deals
  }

  return []
}

export function normalizeDeal(raw: any): NormalizedDeal {
  if (!raw) {
    throw new Error("Cannot normalize empty deal payload")
  }

  if (typeof raw === "object" && "currentPrice" in raw && !("current_price" in raw)) {
    return { ...raw } as NormalizedDeal
  }

  const idValue = raw.id ?? raw.uuid ?? raw.deal_id ?? raw.slug ?? raw.reference
  const destinationName =
    toStringValue(raw.destination) ||
    toStringValue(raw.destination_city) ||
    toStringValue(raw.city) ||
    toStringValue(raw.destinationCity) ||
    "Onbekende bestemming"

  const currentPrice =
    toNumber(raw.current_price) ??
    toNumber(raw.currentPrice) ??
    toNumber(raw.price) ??
    toNumber(raw.value) ??
    0

  const originalPrice =
    toNumber(raw.original_price) ??
    toNumber(raw.originalPrice) ??
    toNumber(raw.old_price) ??
    (currentPrice ? Math.round(currentPrice * 1.2) : undefined)

  const discountPercentage =
    toNumber(raw.discount_percentage) ??
    toNumber(raw.discountPercentage) ??
    (originalPrice && originalPrice > 0
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : undefined)

  const normalized: NormalizedDeal = {
    id: idValue ? String(idValue) : `deal-${Math.random().toString(36).slice(2, 8)}`,
    origin: toStringValue(raw.origin) || toStringValue(raw.origin_airport),
    originCity: toStringValue(raw.origin_city) || toStringValue(raw.originCity),
    destination: destinationName,
    destinationCity:
      toStringValue(raw.destination_city) ||
      toStringValue(raw.city_name) ||
      toStringValue(raw.destinationCity),
    country: toStringValue(raw.country) || toStringValue(raw.country_name) || toStringValue(raw.countryName),
    currentPrice,
    originalPrice,
    discountPercentage,
    airline: toStringValue(raw.airline) || toStringValue(raw.airline_name),
    airlineCode: toStringValue(raw.airline_code),
    departureDate:
      toIsoString(raw.departure_date) ||
      toIsoString(raw.depart_date) ||
      toIsoString(raw.departureDate) ||
      toIsoString(raw.depart_at),
    returnDate:
      toIsoString(raw.return_date) ||
      toIsoString(raw.returnDate) ||
      toIsoString(raw.return_at),
    dealExpiration:
      toIsoString(raw.deal_expiration) ||
      toIsoString(raw.dealExpiration) ||
      toIsoString(raw.valid_until),
    expiresAt: toIsoString(raw.expires_at),
    seatsAvailable:
      toNumber(raw.seats_available) ||
      toNumber(raw.seatsAvailable) ||
      toNumber(raw.seats_remaining),
    affiliateUrl: toStringValue(raw.affiliate_url) || toStringValue(raw.affiliateUrl),
    bookingUrl:
      toStringValue(raw.booking_url) ||
      toStringValue(raw.bookingUrl) ||
      toStringValue(raw.link) ||
      toStringValue(raw.deep_link) ||
      toStringValue(raw.deeplink),
    imageUrl:
      toStringValue(raw.image_url) ||
      toStringValue(raw.imageUrl) ||
      (raw.image && typeof raw.image === "object"
        ? toStringValue(raw.image.src) || toStringValue(raw.image.url)
        : toStringValue(raw.image)),
    airlineLogoUrl:
      toStringValue(raw.airline_logo_url) ||
      toStringValue(raw.airline_logo) ||
      toStringValue(raw.airlineLogoUrl),
    rating: toNumber(raw.rating),
    reviewCount: toNumber(raw.review_count) || toNumber(raw.reviewCount),
    competitorPrice: toNumber(raw.competitor_price) || toNumber(raw.competitorPrice),
    bookingsToday:
      toNumber(raw.daily_bookings) ||
      toNumber(raw.bookings_today) ||
      toNumber(raw.bookingsToday),
    partner: toStringValue(raw.partner_id) || toStringValue(raw.partner),
    category: toStringValue(raw.category) || toStringValue(raw.deal_category),
    durationDays: toNumber(raw.duration_days) || toNumber(raw.durationDays),
    isFeatured: toBoolean(raw.is_featured) ?? toBoolean(raw.isFeatured) ?? false,
    isActive: toBoolean(raw.is_active) ?? toBoolean(raw.isActive) ?? true,
    isDealOfDay: toBoolean(raw.is_deal_of_day) ?? toBoolean(raw.isDealOfDay),
    isSample: Boolean(raw.isSample),
    createdAt: toIsoString(raw.created_at) || toIsoString(raw.createdAt),
    updatedAt: toIsoString(raw.updated_at) || toIsoString(raw.updatedAt),
  }

  if (!Number.isFinite(normalized.currentPrice)) {
    normalized.currentPrice = 0
  }

  return normalized
}

export function normalizeDeals(payload: any): NormalizedDeal[] {
  return extractDealsArray(payload).map((item) => normalizeDeal(item))
}

function fallbackExpiration(existing?: string) {
  if (existing) {
    const date = new Date(existing)
    if (!Number.isNaN(date.getTime())) {
      return date.toISOString()
    }
  }
  return new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString()
}

export function normalizedToAdminDeal(deal: NormalizedDeal): AdminDealRecord {
  const originalPrice = deal.originalPrice ?? deal.currentPrice
  const discount =
    deal.discountPercentage ??
    (originalPrice > 0 ? Math.round(((originalPrice - deal.currentPrice) / originalPrice) * 100) : 0)

  return {
    id: deal.id,
    destination: deal.destination,
    country: deal.country || "",
    origin: deal.origin || deal.originCity || "",
    current_price: Math.round(Number.isFinite(deal.currentPrice) ? deal.currentPrice : 0),
    original_price: Math.round(Number.isFinite(originalPrice) ? originalPrice : deal.currentPrice),
    discount_percentage: Math.max(0, Math.round(Number.isFinite(discount) ? discount : 0)),
    airline: deal.airline || "",
    departure_date: deal.departureDate,
    return_date: deal.returnDate,
    deal_expiration: fallbackExpiration(deal.dealExpiration || deal.expiresAt),
    seats_available: Math.max(0, Math.round(deal.seatsAvailable ?? 0)),
    affiliate_url: deal.affiliateUrl || deal.bookingUrl,
    image_url: deal.imageUrl,
    airline_logo_url: deal.airlineLogoUrl,
    rating: deal.rating,
    review_count: deal.reviewCount,
    competitor_price: deal.competitorPrice,
    daily_bookings: deal.bookingsToday,
    category: deal.category,
    partner: deal.partner,
    is_featured: Boolean(deal.isFeatured),
    is_active: deal.isActive ?? true,
    is_deal_of_day: deal.isDealOfDay,
    created_at: deal.createdAt,
    updated_at: deal.updatedAt,
  }
}

function normalizeDateInput(value?: string) {
  if (!value) {
    return undefined
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return undefined
  }

  const iso = trimmed.includes("T") ? trimmed : `${trimmed}T00:00:00Z`
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return undefined
  }

  return date.toISOString()
}

function compactObject<T extends Record<string, any>>(object: T): T {
  return Object.entries(object).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      acc[key] = value
    }
    return acc
  }, {} as Record<string, any>) as T
}

export function mapDealUpsertToExternal(payload: Partial<DealUpsertRequest>) {
  const discount =
    payload.originalPrice !== undefined && payload.currentPrice !== undefined && payload.originalPrice > 0
      ? Math.round(((payload.originalPrice - payload.currentPrice) / payload.originalPrice) * 100)
      : undefined

  return compactObject({
    destination: payload.destination,
    country: payload.country,
    origin: payload.origin,
    current_price: payload.currentPrice,
    original_price: payload.originalPrice,
    discount_percentage: discount,
    airline: payload.airline,
    departure_date: normalizeDateInput(payload.departureDate),
    return_date: normalizeDateInput(payload.returnDate),
    deal_expiration: normalizeDateInput(payload.expirationDate),
    seats_available: payload.seatsAvailable,
    affiliate_url: payload.affiliateUrl,
    image_url: payload.imageUrl,
    airline_logo_url: payload.airlineLogoUrl,
    is_featured: payload.featured,
    is_active: payload.active,
    rating: payload.rating,
    review_count: payload.reviewCount,
    competitor_price: payload.competitorPrice,
    daily_bookings: payload.bookingsToday,
    category: payload.category,
    partner: payload.partner,
    is_deal_of_day: payload.isDealOfDay,
  })
}

export async function fetchPublicDeals(queryString?: string) {
  const path = queryString ? `/deals?${queryString}` : "/deals"
  const data = await externalJson<any>(path)
  return normalizeDeals(data)
}

export async function fetchAdminDeals() {
  const data = await externalJson<any>("/deals", { useAdminKey: true })
  return normalizeDeals(data)
}

export async function createAdminDeal(payload: DealUpsertRequest) {
  const body = JSON.stringify(mapDealUpsertToExternal(payload))
  const data = await externalJson<any>("/deals", { method: "POST", body, useAdminKey: true })
  return normalizeDeal(data)
}

export async function updateAdminDeal(id: string, payload: Partial<DealUpsertRequest>) {
  const body = JSON.stringify(mapDealUpsertToExternal(payload))
  const data = await externalJson<any>(`/deals/${id}`, { method: "PUT", body, useAdminKey: true })
  return normalizeDeal(data)
}

export async function deleteAdminDeal(id: string) {
  await externalFetch(`/deals/${id}`, { method: "DELETE", useAdminKey: true })
}

export function getFallbackDeals(): NormalizedDeal[] {
  return getSampleDeals()
}
