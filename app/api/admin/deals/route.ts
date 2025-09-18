import { NextResponse } from "next/server"
import { ZodError } from "zod"
import {
  ExternalApiError,
  createAdminDeal,
  fetchAdminDeals,
  getFallbackDeals,
  normalizedToAdminDeal,
} from "@/lib/external-deals"
import type { DealUpsertRequest } from "@/lib/types/deals"
import { dealUpsertSchema } from "@/lib/validations/deals"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const deals = await fetchAdminDeals()
    return NextResponse.json(deals.map((deal) => normalizedToAdminDeal(deal)))
  } catch (error) {
    if (error instanceof ExternalApiError) {
      console.error("Failed to fetch admin deals", {
        status: error.status,
        details: error.details,
      })

      if (error.status === 401 || error.status === 403) {
        return NextResponse.json(
          { error: "Geen toegang tot de externe deals API." },
          { status: error.status },
        )
      }
    } else {
      console.error("Unexpected error while fetching admin deals", error)
    }

    const fallbackDeals = getFallbackDeals().map((deal) => normalizedToAdminDeal(deal))
    return NextResponse.json(fallbackDeals, { status: 200 })
  }
}

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const parsed = dealUpsertSchema.parse(json) as DealUpsertRequest
    const created = await createAdminDeal(parsed)
    return NextResponse.json(normalizedToAdminDeal(created), { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Ongeldige invoer", issues: error.issues }, { status: 422 })
    }

    if (error instanceof ExternalApiError) {
      console.error("Failed to create deal via external API", {
        status: error.status,
        details: error.details,
      })
      return NextResponse.json(
        { error: error.message, details: error.details },
        { status: error.status },
      )
    }

    if (error instanceof Error) {
      console.error("Unexpected error while creating deal", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ error: "Onbekende fout" }, { status: 500 })
  }
}
