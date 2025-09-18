export interface NormalizedDeal {
  id: string
  origin?: string
  originCity?: string
  destination: string
  destinationCity?: string
  country?: string
  currentPrice: number
  originalPrice?: number
  discountPercentage?: number
  airline?: string
  airlineCode?: string
  departureDate?: string
  returnDate?: string
  dealExpiration?: string
  expiresAt?: string
  seatsAvailable?: number
  affiliateUrl?: string
  bookingUrl?: string
  imageUrl?: string
  airlineLogoUrl?: string
  rating?: number
  reviewCount?: number
  competitorPrice?: number
  bookingsToday?: number
  partner?: string
  category?: string
  durationDays?: number
  isFeatured?: boolean
  isActive?: boolean
  isDealOfDay?: boolean
  isSample?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface AdminDealRecord {
  id: string
  destination: string
  country: string
  origin?: string
  current_price: number
  original_price: number
  discount_percentage: number
  airline: string
  departure_date?: string
  return_date?: string
  deal_expiration: string
  seats_available: number
  affiliate_url?: string
  image_url?: string
  airline_logo_url?: string
  rating?: number
  review_count?: number
  competitor_price?: number
  daily_bookings?: number
  category?: string
  partner?: string
  is_featured: boolean
  is_active: boolean
  is_deal_of_day?: boolean
  created_at?: string
  updated_at?: string
}

export interface DealUpsertRequest {
  destination: string
  country: string
  origin?: string
  currentPrice: number
  originalPrice: number
  airline: string
  departureDate?: string
  returnDate?: string
  expirationDate?: string
  seatsAvailable: number
  affiliateUrl?: string
  imageUrl?: string
  airlineLogoUrl?: string
  featured?: boolean
  active?: boolean
  rating?: number
  reviewCount?: number
  competitorPrice?: number
  bookingsToday?: number
  category?: string
  partner?: string
  isDealOfDay?: boolean
}

export interface DealsApiResponse {
  items: NormalizedDeal[]
  fallback?: boolean
  error?: string
}
