import type { Metadata } from "next"

import DealsManagement from "@/components/admin/deals-management"

export const metadata: Metadata = {
  title: "Deals beheren | SpotMijnVlucht Admin",
  description: "Voeg nieuwe aanbiedingen toe en beheer bestaande deals",
}

export default function AdminDealsPage() {
  return <DealsManagement />
}
