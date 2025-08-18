interface AffiliateTrackingParams {
  dealId: number
  destination: string
  price: number
  airline: string
  source: string
  medium: string
  campaign: string
  userId?: string
}

export const AFFILIATE_PARTNERS = {
  booking: {
    name: "Booking.com",
    baseUrl: "https://www.booking.com/flights",
    partnerId: "SMV_BOOKING_2024",
    commission: 0.035, // 3.5%
    trackingParam: "aid",
  },
  expedia: {
    name: "Expedia",
    baseUrl: "https://www.expedia.com/Flights",
    partnerId: "SMV_EXPEDIA_2024",
    commission: 0.042, // 4.2%
    trackingParam: "semcid",
  },
  kayak: {
    name: "Kayak",
    baseUrl: "https://www.kayak.com/flights",
    partnerId: "SMV_KAYAK_2024",
    commission: 0.028, // 2.8%
    trackingParam: "a",
  },
  skyscanner: {
    name: "Skyscanner",
    baseUrl: "https://www.skyscanner.com/transport/flights",
    partnerId: "SMV_SKYSCANNER_2024",
    commission: 0.031, // 3.1%
    trackingParam: "associateid",
  },
}

export function generateAffiliateUrl(
  params: AffiliateTrackingParams & { partner?: keyof typeof AFFILIATE_PARTNERS },
): string {
  const partner = AFFILIATE_PARTNERS[params.partner || "booking"]
  const baseUrl = partner.baseUrl

  const urlParams = new URLSearchParams({
    destination: params.destination,
    price: params.price.toString(),
    airline: params.airline,
    deal_id: params.dealId.toString(),
    ref: "spotmijnvlucht",
    utm_source: params.source,
    utm_medium: params.medium,
    utm_campaign: params.campaign,
    utm_content: `deal_${params.dealId}`,
    [partner.trackingParam]: partner.partnerId,
    tracking_id: generateTrackingId(params.dealId),
    timestamp: Date.now().toString(),
    revenue_share: partner.commission.toString(),
  })

  if (params.userId) {
    urlParams.append("user_id", params.userId)
  }

  return `${baseUrl}?${urlParams.toString()}`
}

function generateTrackingId(dealId: number): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  return `SMV_${dealId}_${timestamp}_${random}`
}

export function trackDealClick(dealId: number, destination: string, source: string) {
  // Track the click event for analytics
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "deal_click", {
      event_category: "engagement",
      event_label: destination,
      deal_id: dealId,
      source: source,
      value: 1,
    })
  }

  // Send to internal analytics
  fetch("/api/track-click", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      dealId,
      destination,
      source,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer,
    }),
  }).catch((error) => {
    console.error("Failed to track click:", error)
  })
}

export function trackDealView(dealId: number, destination: string) {
  // Track deal impression
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "deal_view", {
      event_category: "engagement",
      event_label: destination,
      deal_id: dealId,
      value: 1,
    })
  }
}

export function trackConversion(dealId: number, revenue: number, partner: string) {
  const conversionData = {
    dealId,
    revenue,
    partner,
    commission: AFFILIATE_PARTNERS[partner as keyof typeof AFFILIATE_PARTNERS]?.commission || 0,
    timestamp: new Date().toISOString(),
    conversionId: generateTrackingId(dealId),
  }

  // Track conversion in Google Analytics
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "purchase", {
      transaction_id: conversionData.conversionId,
      value: revenue,
      currency: "EUR",
      deal_id: dealId,
      partner: partner,
    })
  }

  // Send to internal conversion tracking
  fetch("/api/track-conversion", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(conversionData),
  }).catch((error) => {
    console.error("Failed to track conversion:", error)
  })
}

export function trackRevenueAttribution(dealId: number, clickId: string, revenue: number) {
  fetch("/api/track-revenue", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      dealId,
      clickId,
      revenue,
      timestamp: new Date().toISOString(),
    }),
  }).catch((error) => {
    console.error("Failed to track revenue:", error)
  })
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}
