"use client"

import { useEffect } from "react"
import { trackPageView, trackEvent, getABTestVariant, trackABTestConversion } from "@/lib/analytics"
import { usePathname } from "next/navigation"

export function usePageTracking() {
  const pathname = usePathname()

  useEffect(() => {
    trackPageView(pathname, document.title)
  }, [pathname])
}

export function useABTest(testName: string, variants: string[]) {
  const variant = getABTestVariant(testName, variants)

  const trackConversion = (conversionType: string) => {
    trackABTestConversion(testName, variant, conversionType)
  }

  return { variant, trackConversion }
}

export function useEventTracking() {
  const track = (eventName: string, parameters?: Record<string, any>) => {
    trackEvent(eventName, parameters)
  }

  return { track }
}
