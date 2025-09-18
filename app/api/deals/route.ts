import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import {
  DEFAULT_DEALS_API_BASE_URL,
  FALLBACK_DEAL,
  normalizeDealsFromPayload,
} from "@/lib/deals"

export const dynamic = "force-dynamic"

const DEFAULT_REMOTE_PATH = "/deals"

const apiBaseUrl = (process.env.DEALS_API_BASE_URL || DEFAULT_DEALS_API_BASE_URL).replace(/\/$/, "")
const apiPath = process.env.DEALS_API_PATH || DEFAULT_REMOTE_PATH
const apiKey = process.env.DEALS_API_KEY || process.env.DEALS_API_TOKEN
const apiAuthHeader = process.env.DEALS_API_AUTH_HEADER || "Authorization"
const apiKeyPrefix = process.env.DEALS_API_KEY_PREFIX ?? "Bearer "

function buildRemoteUrl(requestUrl: URL): string {
  const remoteBase = apiPath.startsWith("http")
    ? apiPath
    : `${apiBaseUrl}${apiPath.startsWith("/") ? apiPath : `/${apiPath}`}`

  const remoteUrl = new URL(remoteBase)

  requestUrl.searchParams.forEach((value, key) => {
    if (value !== null && value !== undefined) {
      remoteUrl.searchParams.set(key, value)
    }
  })

  return remoteUrl.toString()
}

function buildHeaders() {
  const headers: Record<string, string> = {
    Accept: "application/json",
  }

  if (apiKey) {
    if (apiAuthHeader.toLowerCase() === "authorization") {
      headers[apiAuthHeader] = `${apiKeyPrefix}${apiKey}`.trim()
    } else {
      headers[apiAuthHeader] = apiKey
    }
  }

  return headers
}

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url)
  const remoteUrl = buildRemoteUrl(requestUrl)

  try {
    const response = await fetch(remoteUrl, {
      method: "GET",
      headers: buildHeaders(),
      cache: "no-store",
    })

    const text = await response.text()
    let payload: unknown

    if (text) {
      try {
        payload = JSON.parse(text)
      } catch (error) {
        console.error("Deals API returned non-JSON payload", error)
        payload = null
      }
    }

    if (!response.ok) {
      const message =
        typeof payload === "object" && payload !== null && "error" in payload
          ? String((payload as Record<string, unknown>).error)
          : typeof payload === "object" && payload !== null && "message" in payload
            ? String((payload as Record<string, unknown>).message)
            : text || `Remote API error (${response.status})`

      console.error("Deals API error:", response.status, message)
      return NextResponse.json({ error: message }, { status: response.status })
    }

    const items = normalizeDealsFromPayload(payload)

    if (items.length === 0) {
      console.warn("Deals API returned no usable items. Falling back to default deal.")
    }

    return NextResponse.json({ items: items.length > 0 ? items : [FALLBACK_DEAL] })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Onbekende fout bij het ophalen van deals."
    console.error("Failed to load deals:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
