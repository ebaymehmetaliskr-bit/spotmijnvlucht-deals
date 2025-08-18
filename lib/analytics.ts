declare global {
  interface Window {
    gtag: (...args: any[]) => void
    hj: (...args: any[]) => void
  }
}

// Google Analytics tracking functions
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, {
      event_category: "engagement",
      event_label: parameters?.label,
      value: parameters?.value,
      ...parameters,
    })
  }
}

export const trackConversion = (conversionId: string, value?: number, currency = "EUR") => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "conversion", {
      send_to: conversionId,
      value: value,
      currency: currency,
    })
  }
}

export const trackPurchase = (transactionId: string, value: number, items: any[]) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "purchase", {
      transaction_id: transactionId,
      value: value,
      currency: "EUR",
      items: items,
    })
  }
}

export const trackDealClick = (dealId: string, destination: string, price: number, airline: string) => {
  trackEvent("deal_click", {
    event_category: "deals",
    event_label: destination,
    custom_parameters: {
      deal_id: dealId,
      destination: destination,
      price: price,
      airline: airline,
    },
  })

  // Also track in Hotjar
  if (typeof window !== "undefined" && window.hj) {
    window.hj("event", "deal_click")
  }
}

export const trackNewsletterSignup = (email: string) => {
  trackEvent("newsletter_signup", {
    event_category: "engagement",
    event_label: "newsletter",
  })

  trackConversion("AW-CONVERSION_ID/newsletter_signup")

  if (typeof window !== "undefined" && window.hj) {
    window.hj("event", "newsletter_signup")
  }
}

export const trackPriceAlertSignup = (destination: string, maxPrice: number) => {
  trackEvent("price_alert_signup", {
    event_category: "engagement",
    event_label: destination,
    value: maxPrice,
  })

  if (typeof window !== "undefined" && window.hj) {
    window.hj("event", "price_alert_signup")
  }
}

export const trackSearchQuery = (query: string, filters: any) => {
  trackEvent("search", {
    event_category: "search",
    event_label: query,
    custom_parameters: {
      search_term: query,
      filters: JSON.stringify(filters),
    },
  })
}

export const trackPageView = (pagePath: string, pageTitle: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
      page_path: pagePath,
      page_title: pageTitle,
    })
  }
}

// A/B Testing utilities
export const getABTestVariant = (testName: string, variants: string[]): string => {
  if (typeof window === "undefined") return variants[0]

  // Get or create user ID for consistent variant assignment
  let userId = localStorage.getItem("ab_user_id")
  if (!userId) {
    userId = Math.random().toString(36).substring(2, 15)
    localStorage.setItem("ab_user_id", userId)
  }

  // Simple hash function to determine variant
  const hash = userId.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0)
    return a & a
  }, 0)

  const variantIndex = Math.abs(hash) % variants.length
  const selectedVariant = variants[variantIndex]

  // Track the variant assignment
  trackEvent("ab_test_assignment", {
    event_category: "ab_testing",
    event_label: testName,
    custom_parameters: {
      test_name: testName,
      variant: selectedVariant,
      user_id: userId,
    },
  })

  return selectedVariant
}

export const trackABTestConversion = (testName: string, variant: string, conversionType: string) => {
  trackEvent("ab_test_conversion", {
    event_category: "ab_testing",
    event_label: `${testName}_${variant}`,
    custom_parameters: {
      test_name: testName,
      variant: variant,
      conversion_type: conversionType,
    },
  })
}

// Heatmap and user behavior tracking
export const trackUserBehavior = (action: string, element: string, data?: any) => {
  if (typeof window !== "undefined" && window.hj) {
    window.hj("event", action, {
      element: element,
      data: data,
    })
  }

  trackEvent("user_behavior", {
    event_category: "behavior",
    event_label: action,
    custom_parameters: {
      element: element,
      data: JSON.stringify(data),
    },
  })
}

// Performance tracking
export const trackPerformance = (metric: string, value: number) => {
  trackEvent("performance", {
    event_category: "performance",
    event_label: metric,
    value: value,
  })
}

// Error tracking
export const trackError = (error: string, context?: string) => {
  trackEvent("error", {
    event_category: "error",
    event_label: error,
    custom_parameters: {
      error_message: error,
      context: context,
    },
  })

  if (typeof window !== "undefined" && window.hj) {
    window.hj("event", "error")
  }
}
