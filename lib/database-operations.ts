import { createAdminClient } from "./supabase/server"

export interface Deal {
  id: string
  destination: string
  country: string
  origin: string
  current_price: number
  original_price: number
  discount_percentage: number
  airline: string
  airline_logo_url?: string
  departure_date?: string
  return_date?: string
  deal_expiration: string
  seats_available: number
  affiliate_url: string
  is_featured: boolean
  is_active: boolean
  destination_image_url?: string
  category: string
  rating: number
  review_count: number
  last_booked_at: string
  booking_count: number
  created_at: string
  updated_at: string
}

export interface Subscriber {
  id: string
  email: string
  name?: string
  is_active: boolean
  subscription_type: string
  preferences: Record<string, any>
  subscribed_at: string
  last_email_sent?: string
  email_count: number
  source: string
}

export interface ClickTracking {
  id: string
  deal_id: string
  user_id?: string
  session_id?: string
  clicked_at: string
  user_agent?: string
  ip_address?: string
  referrer?: string
  converted: boolean
  conversion_value?: number
  converted_at?: string
}

export interface AnalyticsEvent {
  id: string
  event_type: string
  event_data: Record<string, any>
  user_id?: string
  session_id?: string
  deal_id?: string
  created_at: string
  user_agent?: string
  ip_address?: string
  referrer?: string
}

// Deal operations
export async function getAllDeals(): Promise<Deal[]> {
  const supabase = createAdminClient()
  if (!supabase) return []

  const { data, error } = await supabase.from("deals").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching deals:", error)
    return []
  }

  return data || []
}

export async function createDeal(
  dealData: Omit<Deal, "id" | "created_at" | "updated_at" | "discount_percentage">,
): Promise<Deal | null> {
  const supabase = createAdminClient()
  if (!supabase) return null

  const { data, error } = await supabase.from("deals").insert([dealData]).select().single()

  if (error) {
    console.error("Error creating deal:", error)
    return null
  }

  return data
}

export async function updateDeal(id: string, dealData: Partial<Deal>): Promise<Deal | null> {
  const supabase = createAdminClient()
  if (!supabase) return null

  const { data, error } = await supabase.from("deals").update(dealData).eq("id", id).select().single()

  if (error) {
    console.error("Error updating deal:", error)
    return null
  }

  return data
}

export async function deleteDeal(id: string): Promise<boolean> {
  const supabase = createAdminClient()
  if (!supabase) return false

  const { error } = await supabase.from("deals").delete().eq("id", id)

  if (error) {
    console.error("Error deleting deal:", error)
    return false
  }

  return true
}

// Subscriber operations
export async function getAllSubscribers(): Promise<Subscriber[]> {
  const supabase = createAdminClient()
  if (!supabase) return []

  const { data, error } = await supabase.from("subscribers").select("*").order("subscribed_at", { ascending: false })

  if (error) {
    console.error("Error fetching subscribers:", error)
    return []
  }

  return data || []
}

export async function addSubscriber(email: string, name?: string, source?: string): Promise<Subscriber | null> {
  const supabase = createAdminClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from("subscribers")
    .insert([{ email, name, source: source || "website" }])
    .select()
    .single()

  if (error) {
    console.error("Error adding subscriber:", error)
    return null
  }

  return data
}

// Analytics operations
export async function trackClick(dealId: string, sessionId?: string, userAgent?: string): Promise<void> {
  const supabase = createAdminClient()
  if (!supabase) return

  await supabase.from("click_tracking").insert([
    {
      deal_id: dealId,
      session_id: sessionId,
      user_agent: userAgent,
    },
  ])
}

export async function trackEvent(eventType: string, eventData: Record<string, any>, dealId?: string): Promise<void> {
  const supabase = createAdminClient()
  if (!supabase) return

  await supabase.from("analytics_events").insert([
    {
      event_type: eventType,
      event_data: eventData,
      deal_id: dealId,
    },
  ])
}

// Dashboard stats
export async function getDashboardStats() {
  const supabase = createAdminClient()
  if (!supabase) return null

  try {
    const [dealsResult, subscribersResult, clicksResult] = await Promise.all([
      supabase.from("deals").select("id, is_active"),
      supabase.from("subscribers").select("id, is_active"),
      supabase.from("click_tracking").select("id, clicked_at, converted, conversion_value"),
    ])

    const deals = dealsResult.data || []
    const subscribers = subscribersResult.data || []
    const clicks = clicksResult.data || []

    return {
      totalDeals: deals.length,
      activeDeals: deals.filter((d) => d.is_active).length,
      totalSubscribers: subscribers.length,
      activeSubscribers: subscribers.filter((s) => s.is_active).length,
      totalClicks: clicks.length,
      conversions: clicks.filter((c) => c.converted).length,
      totalRevenue: clicks
        .filter((c) => c.converted && c.conversion_value)
        .reduce((sum, c) => sum + (c.conversion_value || 0), 0),
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return null
  }
}

// Newsletter subscription function for compatibility
export async function subscribeToNewsletter(email: string, preferences: Record<string, any> = {}) {
  try {
    const subscriber = await addSubscriber(email, undefined, "newsletter")

    if (subscriber) {
      return { success: true, subscriber }
    } else {
      return { success: false, error: "Failed to subscribe" }
    }
  } catch (error) {
    console.error("Error subscribing to newsletter:", error)
    return { success: false, error: "Failed to subscribe" }
  }
}
