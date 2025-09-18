import type { Metadata } from "next"
import type { ReactNode } from "react"

import AdminLayout from "@/components/admin/admin-layout"

export const metadata: Metadata = {
  title: "SpotMijnVlucht Admin",
  description: "Beheer je vluchtdeals, abonnees en analytics",
}

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>
}
