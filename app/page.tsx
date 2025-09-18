import HomePageClient from "@/components/home/home-page-client"
import { ExternalApiError, fetchPublicDeals, getFallbackDeals } from "@/lib/external-deals"
import type { NormalizedDeal } from "@/lib/types/deals"

export const dynamic = "force-dynamic"

interface InitialDealsResult {
  deals: NormalizedDeal[]
  fallback: boolean
  error: string | null
}

async function loadInitialDeals(): Promise<InitialDealsResult> {
  try {
    const deals = await fetchPublicDeals()
    return { deals, fallback: false, error: null }
  } catch (error) {
    let message = "Onbekende fout"

    if (error instanceof ExternalApiError) {
      console.error("External deals API error", {
        status: error.status,
        details: error.details,
      })
      message = error.message
    } else if (error instanceof Error) {
      console.error("Unexpected error while fetching deals", error)
      message = error.message
    }

    const fallbackDeals = getFallbackDeals()
    return { deals: fallbackDeals, fallback: true, error: message }
  }
}

export default async function HomePage() {
  const { deals, fallback, error } = await loadInitialDeals()

  return <HomePageClient initialDeals={deals} fallbackUsed={fallback} initialError={error} />
}
