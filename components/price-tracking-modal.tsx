"use client"

import type React from "react"

import { useState } from "react"
import { X, Bell, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface PriceTrackingModalProps {
  isOpen: boolean
  onClose: () => void
  destination?: string
  currentPrice?: number
}

export default function PriceTrackingModal({
  isOpen,
  onClose,
  destination = "",
  currentPrice = 0,
}: PriceTrackingModalProps) {
  const [email, setEmail] = useState("")
  const [targetPrice, setTargetPrice] = useState(currentPrice > 0 ? Math.floor(currentPrice * 0.8) : 50)
  const [selectedDestination, setSelectedDestination] = useState(destination)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const destinations = [
    "Istanbul",
    "Barcelona",
    "London",
    "Rome",
    "Prague",
    "Amsterdam",
    "Paris",
    "Berlin",
    "Vienna",
    "Budapest",
    "Madrid",
    "Lisbon",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSuccess(true)

    // Reset form after 2 seconds
    setTimeout(() => {
      setIsSuccess(false)
      setEmail("")
      setTargetPrice(50)
      setSelectedDestination("")
      onClose()
    }, 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>

        {!isSuccess ? (
          <>
            <div className="flex items-center mb-6">
              <Bell className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">Prijsalert Instellen</h2>
            </div>

            <p className="text-gray-600 mb-6">
              Ontvang een melding wanneer de prijs voor jouw gewenste bestemming daalt onder jouw doelprijs.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bestemming</label>
                <select
                  value={selectedDestination}
                  onChange={(e) => setSelectedDestination(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Kies een bestemming</option>
                  {destinations.map((dest) => (
                    <option key={dest} value={dest}>
                      {dest}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gewenste prijs (€)</label>
                <Input
                  type="number"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(Number.parseInt(e.target.value) || 0)}
                  placeholder="Bijv. 75"
                  className="h-12"
                  required
                  min="1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Je ontvangt een melding als de prijs onder €{targetPrice} komt
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">E-mailadres</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jouw@email.nl"
                  className="h-12"
                  required
                />
              </div>

              <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                {isSubmitting ? "Instellen..." : "Prijsalert Instellen"}
              </Button>
            </form>

            <p className="text-xs text-gray-500 mt-4 text-center">
              We sturen je maximaal 1 melding per dag en je kunt je altijd uitschrijven.
            </p>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Prijsalert Ingesteld!</h3>
            <p className="text-gray-600">
              We sturen je een melding zodra de prijs voor {selectedDestination} onder €{targetPrice} komt.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
