import { NextResponse } from "next/server"
import { ZodError } from "zod"
import { ExternalApiError, deleteAdminDeal, updateAdminDeal, normalizedToAdminDeal } from "@/lib/external-deals"
import type { DealUpsertRequest } from "@/lib/types/deals"
import { dealUpsertSchema } from "@/lib/validations/deals"

export const dynamic = "force-dynamic"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = params.id

  if (!id) {
    return NextResponse.json({ error: "Deal ID ontbreekt" }, { status: 400 })
  }

  try {
    const json = await req.json()
    const parsed = dealUpsertSchema.partial().parse(json) as Partial<DealUpsertRequest>

    if (Object.keys(parsed).length === 0) {
      return NextResponse.json({ error: "Geen velden om bij te werken" }, { status: 400 })
    }

    const updated = await updateAdminDeal(id, parsed)
    return NextResponse.json(normalizedToAdminDeal(updated))
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Ongeldige invoer", issues: error.issues }, { status: 422 })
    }

    if (error instanceof ExternalApiError) {
      console.error("Failed to update deal via external API", {
        status: error.status,
        details: error.details,
      })
      return NextResponse.json(
        { error: error.message, details: error.details },
        { status: error.status },
      )
    }

    if (error instanceof Error) {
      console.error("Unexpected error while updating deal", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ error: "Onbekende fout" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const id = params.id

  if (!id) {
    return NextResponse.json({ error: "Deal ID ontbreekt" }, { status: 400 })
  }

  try {
    await deleteAdminDeal(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof ExternalApiError) {
      console.error("Failed to delete deal via external API", {
        status: error.status,
        details: error.details,
      })
      return NextResponse.json(
        { error: error.message, details: error.details },
        { status: error.status },
      )
    }

    if (error instanceof Error) {
      console.error("Unexpected error while deleting deal", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ error: "Onbekende fout" }, { status: 500 })
  }
}
