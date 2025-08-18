"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, CheckCircle, AlertCircle, Shield, Gift } from "lucide-react"

export default function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes("@")) {
      setStatus("error")
      setMessage("Voer een geldig e-mailadres in")
      return
    }

    setStatus("loading")

    // Simulate API call
    setTimeout(() => {
      setStatus("success")
      setMessage("Welkom! Je ontvangt binnenkort je eerste exclusieve deals.")
      setEmail("")
    }, 1500)
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-indigo-700">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-6">
            <Mail className="h-8 w-8 text-white" />
          </div>

          <h2 className="text-3xl font-bold text-white mb-4">Ontvang Exclusieve Deals</h2>

          <p className="text-xl text-blue-100 mb-2">Gemiddeld €300 besparing per boeking</p>

          <p className="text-blue-200 max-w-2xl mx-auto">
            Wees de eerste die hoort over flash sales, last-minute deals en exclusieve aanbiedingen die niet op de
            website staan.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="flex items-center justify-center gap-3 text-white">
            <Gift className="h-5 w-5 text-yellow-300" />
            <span>Exclusieve deals</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-white">
            <CheckCircle className="h-5 w-5 text-green-300" />
            <span>Geen spam, alleen deals</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-white">
            <Shield className="h-5 w-5 text-blue-300" />
            <span>Uitschrijven altijd mogelijk</span>
          </div>
        </div>

        {/* Newsletter Form */}
        <div className="max-w-md mx-auto">
          {status === "success" ? (
            <div className="bg-green-500 text-white p-6 rounded-lg">
              <CheckCircle className="h-8 w-8 mx-auto mb-3" />
              <h3 className="font-bold mb-2">Gelukt!</h3>
              <p>{message}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="je@email.nl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white/90 border-0 text-gray-900 placeholder:text-gray-500"
                  disabled={status === "loading"}
                />
                <Button
                  type="submit"
                  disabled={status === "loading"}
                  className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold px-8 whitespace-nowrap"
                >
                  {status === "loading" ? "Bezig..." : "Ja, ik wil deals!"}
                </Button>
              </div>

              {status === "error" && (
                <div className="flex items-center gap-2 text-red-200 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{message}</span>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Privacy Assurance */}
        <div className="mt-8 text-center">
          <p className="text-blue-200 text-sm max-w-2xl mx-auto">
            <Shield className="h-4 w-4 inline mr-1" />
            Je privacy is belangrijk voor ons. We delen je gegevens nooit met derden en je kunt je altijd uitschrijven.
            Lees onze{" "}
            <a href="#" className="underline hover:text-white">
              privacyverklaring
            </a>
            .
          </p>
        </div>

        {/* Social Proof */}
        <div className="mt-8 bg-white/10 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white mb-1">25.000+</div>
              <div className="text-blue-200 text-sm">Nieuwsbrief abonnees</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white mb-1">€300</div>
              <div className="text-blue-200 text-sm">Gemiddelde besparing</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white mb-1">48u</div>
              <div className="text-blue-200 text-sm">Exclusieve toegang</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
