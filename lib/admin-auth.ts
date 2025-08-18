import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function checkAdminAuth() {
  const cookieStore = await cookies()
  const adminSession = cookieStore.get("admin-session")

  if (!adminSession || adminSession.value !== "authenticated") {
    redirect("/admin")
  }

  return true
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies()
  const adminSession = cookieStore.get("admin-session")

  return adminSession?.value === "authenticated"
}
