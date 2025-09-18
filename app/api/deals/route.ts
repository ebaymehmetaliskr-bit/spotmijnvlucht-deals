import { NextResponse } from "next/server"
import { ExternalApiError, fetchPublicDeals, getFallbackDeals } from "@/lib/external-deals"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const forwardedParams = new URLSearchParams()

  searchParams.forEach((value, key) => {
    if (value) {
      forwardedParams.set(key, value)
    }
  })

  const origin = searchParams.get("from") || searchParams.get("origin")
  const destination = searchParams.get("to") || searchParams.get("destination")

  if (origin) {
    forwardedParams.set("origin", origin)
    forwardedParams.set("from", origin)
  }

  if (destination) {
    forwardedParams.set("destination", destination)
    forwardedParams.set("to", destination)
  }

  if (!forwardedParams.has("limit")) {
    forwardedParams.set("limit", "30")
  }

  try {
    const deals = await fetchPublicDeals(forwardedParams.toString())
    return NextResponse.json({ items: deals })
  } catch (error) {
    if (error instanceof ExternalApiError) {
      console.error("External deals API error", {
        status: error.status,
        details: error.details,
      })
    } else {
      console.error("Unexpected error while fetching deals", error)
    }

    const fallbackDeals = getFallbackDeals()

    return NextResponse.json(
      {
        items: fallbackDeals,
        fallback: true,
        error: error instanceof Error ? error.message : "Onbekende fout", 
      },
      { status: 200 },
    )
  }
}
