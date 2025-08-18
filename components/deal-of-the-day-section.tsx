"use client"

import { useState, useEffect } from "react"
import { Star, Clock, Users, Plane } from "lucide-react"
import { Button } from "@/components/ui/button"
import { generateAffiliateUrl, trackDealClick } from "@/lib/affiliate-tracking"

interface Deal {
  id: number
  destination: string
  country: string
  originalPrice: number
  currentPrice: number
  discount: number
  airline: string
  seatsRemaining: number
  image: string
  airlineLogo: string
  expiresAt: Date
}

interface DealOfTheDaySectionProps {
  deal: Deal
}

export default function DealOfTheDaySection({ deal }: DealOfTheDaySectionProps) {
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = deal.expiresAt.getTime() - now

      if (distance > 0) {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)

        setTimeLeft(
          `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
        )
      } else {
        setTimeLeft("VERLOPEN")
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [deal.expiresAt])

  const handleBookDeal = () => {
    trackDealClick(deal.id, deal.destination, "deal_of_the_day")

    const affiliateUrl = generateAffiliateUrl({
      dealId: deal.id,
      destination: deal.destination,
      price: deal.currentPrice,
      airline: deal.airline,
      source: "spotmijnvlucht",
      medium: "deal_of_the_day",
      campaign: "daily_featured_deal",
    })

    window.open(affiliateUrl, "_blank")
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center bg-white bg-opacity-20 rounded-full px-4 py-2 mb-4">
            <Star className="h-5 w-5 text-yellow-300 mr-2" />
            <span className="text-white font-semibold">Deal van de Dag</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-2">Vandaag Only: Mega Korting!</h2>
          <p className="text-white text-opacity-90 text-lg">Deze deal verdwijnt om middernacht - mis het niet!</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image Section */}
            <div className="relative h-64 lg:h-auto">
              <img
                src={deal.image || "/placeholder.svg"}
                alt={deal.destination}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                  -{deal.discount}% KORTING
                </div>
              </div>
              <div className="absolute top-4 right-4">
                <img
                  src={deal.airlineLogo || "/placeholder.svg"}
                  alt={deal.airline}
                  className="h-8 w-auto bg-white rounded p-1"
                />
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{deal.destination}</h3>
                  <p className="text-gray-600">{deal.country}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 line-through">€{deal.originalPrice}</p>
                  <p className="text-3xl font-bold text-red-500">€{deal.currentPrice}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <Clock className="h-5 w-5 text-gray-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Tijd over</p>
                  <p className="font-bold text-red-500">{timeLeft}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <Users className="h-5 w-5 text-gray-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Plekken over</p>
                  <p className="font-bold text-orange-500">{deal.seatsRemaining} plekken</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Populariteit</span>
                  <span>87% geboekt</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full w-[87%]"></div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleBookDeal}
                  className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-lg"
                >
                  <Plane className="h-5 w-5 mr-2" />
                  Boek Nu - €{deal.currentPrice}
                </Button>
                <p className="text-center text-xs text-gray-500">
                  Inclusief belastingen • Gratis annulering tot 24u voor vertrek
                </p>
              </div>

              <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800 font-medium">
                  🔥 Laatste kans! Deze deal is al 156 keer bekeken vandaag
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-white text-opacity-80 text-sm">
            Elke dag om 00:00 een nieuwe Deal van de Dag • Schrijf je in voor de nieuwsbrief om niets te missen
          </p>
        </div>
      </div>
    </section>
  )
}
