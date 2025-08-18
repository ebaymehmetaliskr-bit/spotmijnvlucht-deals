import { createClient } from "./supabase/server"
import { supabase } from "./supabase/client"

export interface FlightDeal {
  id: string
  destination: string
  country: string
  city: string
  original_price: number
  current_price: number
  discount_percentage: number
  airline: string
  airline_logo?: string
  image_url?: string
  departure_date?: string
  return_date?: string
  seats_remaining: number
  deal_expires_at?: string
  category: string
  rating: number
  review_count: number
  competitor_price?: number
  daily_bookings: number
  partner_id?: string
  affiliate_url?: string
  is_featured: boolean
  is_deal_of_day: boolean
  created_at: string
  updated_at: string
}

export interface EmailSubscription {
  id: string
  email: string
  user_id?: string
  subscription_type: string
  is_active: boolean
  preferences: any
  subscribed_at: string
  unsubscribed_at?: string
}

export interface ClickTracking {
  id: string
  deal_id: string
  user_id?: string
  session_id?: string
  ip_address?: string
  user_agent?: string
  referrer?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  clicked_at: string
}

// Server-side database functions
export async function getFlightDeals(category?: string, limit?: number) {
  const client = createClient()

  let query = client.from("flight_deals").select("*").order("created_at", { ascending: false })

  if (category) {
    query = query.eq("category", category)
  }

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching flight deals:", error)
    return []
  }

  return data as FlightDeal[]
}

export async function getDealOfTheDay() {
  const client = createClient()

  const { data, error } = await client.from("flight_deals").select("*").eq("is_deal_of_day", true).single()

  if (error) {
    console.error("Error fetching deal of the day:", error)
    return null
  }

  return data as FlightDeal
}

export async function trackClick(dealId: string, sessionId: string, metadata: any = {}) {
  const client = createClient()

  const { error } = await client.from("click_tracking").insert({
    deal_id: dealId,
    session_id: sessionId,
    ...metadata,
  })

  if (error) {
    console.error("Error tracking click:", error)
  }
}

export async function subscribeToNewsletter(email: string, preferences: any = {}) {
  const client = createClient()

  const { data, error } = await client
    .from("email_subscriptions")
    .upsert({
      email,
      subscription_type: "newsletter",
      preferences,
      is_active: true,
    })
    .select()

  if (error) {
    console.error("Error subscribing to newsletter:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

// Client-side database functions
export async function subscribeToNewsletterClient(email: string, preferences: any = {}) {
  const { data, error } = await supabase
    .from("email_subscriptions")
    .upsert({
      email,
      subscription_type: "newsletter",
      preferences,
      is_active: true,
    })
    .select()

  if (error) {
    console.error("Error subscribing to newsletter:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function createPriceAlert(email: string, destination: string, maxPrice: number) {
  const { data, error } = await supabase
    .from("price_alerts")
    .insert({
      email,
      destination,
      max_price: maxPrice,
      is_active: true,
    })
    .select()

  if (error) {
    console.error("Error creating price alert:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}
