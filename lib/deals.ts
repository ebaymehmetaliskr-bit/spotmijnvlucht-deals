const SEAT_FIELD_KEYS = [
  "seatsRemaining",
  "seats_remaining",
  "seatsAvailable",
  "seats_available",
  "availableSeats",
  "available_seats",
  "availableSeatCount",
  "available_seat_count",
  "seatsLeft",
  "seats_left",
  "remainingSeats",
  "remaining_seats",
  "seatCount",
  "seat_count",
  "seats",
] as const

export type SeatFieldKey = (typeof SEAT_FIELD_KEYS)[number]
export type SeatValue = number | string | boolean | bigint | null | undefined

export interface SeatAwareDeal extends Partial<Record<SeatFieldKey, SeatValue>> {
  raw?: unknown
  metadata?: unknown
  meta?: unknown
  details?: unknown
  [key: string]: unknown
}

export const DEFAULT_SEATS_REMAINING = 6

type SeatEntry = {
  key: string
  value: Exclude<SeatValue, null | undefined>
}

const isSeatValueCandidate = (value: unknown): value is Exclude<SeatValue, null | undefined> => {
  const valueType = typeof value

  return valueType === "number" || valueType === "string" || valueType === "bigint" || valueType === "boolean"
}

const toNumber = (value: Exclude<SeatValue, null | undefined>): number => {
  let result: number

  if (typeof value === "number") {
    result = value
  } else if (typeof value === "bigint") {
    result = Number(value)
  } else if (typeof value === "boolean") {
    result = value ? 1 : 0
  } else if (typeof value === "string") {
    const trimmed = value.trim()

    if (trimmed.length === 0) {
      return NaN
    }

    result = Number(trimmed)
  } else {
    result = Number(value)
  }

  return Number.isFinite(result) ? result : NaN
}

const collectSeatEntriesFromUnknown = (
  source: unknown,
  prefix = "",
  seen = new WeakSet<object>(),
): SeatEntry[] => {
  if (!source || typeof source !== "object") {
    return []
  }

  const sourceObject = source as Record<string, unknown>

  if (seen.has(sourceObject)) {
    return []
  }

  seen.add(sourceObject)

  const entries: SeatEntry[] = []

  for (const [key, value] of Object.entries(sourceObject)) {
    const nextPrefix = prefix ? `${prefix}.${key}` : key

    if (value !== null && typeof value === "object") {
      entries.push(...collectSeatEntriesFromUnknown(value, nextPrefix, seen))
      continue
    }

    if (key.toLowerCase().includes("seat") && value !== null && value !== undefined && isSeatValueCandidate(value)) {
      entries.push({ key: nextPrefix, value })
    }
  }

  return entries
}

const collectSeatEntries = (deal: SeatAwareDeal): SeatEntry[] => {
  const entries: SeatEntry[] = []

  for (const key of SEAT_FIELD_KEYS) {
    if (key in deal) {
      const value = deal[key]

      if (value !== null && value !== undefined && isSeatValueCandidate(value)) {
        entries.push({ key, value })
      }
    }
  }

  const nestedSources = [
    ["raw", deal.raw],
    ["metadata", (deal as Record<string, unknown>).metadata],
    ["meta", (deal as Record<string, unknown>).meta],
    ["details", (deal as Record<string, unknown>).details],
  ] as const

  for (const [prefix, value] of nestedSources) {
    entries.push(...collectSeatEntriesFromUnknown(value, prefix))
  }

  return entries
}

export function resolveSeatsRemaining(
  deal: SeatAwareDeal,
  defaultSeats: number = DEFAULT_SEATS_REMAINING,
): number {
  const seatEntries = collectSeatEntries(deal)

  if (seatEntries.length === 0) {
    return defaultSeats
  }

  for (const entry of seatEntries) {
    const numericValue = toNumber(entry.value)

    if (!Number.isNaN(numericValue)) {
      return numericValue
    }
  }

  return defaultSeats
}
