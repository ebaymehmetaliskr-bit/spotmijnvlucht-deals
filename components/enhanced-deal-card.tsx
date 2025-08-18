"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  MapPin,
  Clock,
  AlertTriangle,
  Users,
  Eye,
  TrendingUp,
  ExternalLink,
  Star,
  Shield,
  Award,
  Zap,
} from "lucide-react"
import { generateAffiliateUrl, trackDealClick, trackDealView, AFFILIATE_PARTNERS } from "@/lib/affiliate-tracking"
import { ButtonLoadingState } from "@/components/loading-states"

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
  partner?: keyof typeof AFFILIATE_PARTNERS
  rating?: number
  reviewCount?: number
  competitorPrice?: number
  bookingsToday?: number
}

interface CountdownTimerProps {
  expiresAt: Date
}

function CountdownTimer({ expiresAt }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = expiresAt.getTime() - now

      if (distance > 0) {
        setTimeLeft({
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [expiresAt])

  const isVeryUrgent = timeLeft.hours < 2
  const urgencyColor = isVeryUrgent
    ? "text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-700"
    : "text-orange-600 bg-orange-50 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700"

  return (
    <div
      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold ${urgencyColor} animate-pulse-custom`}
    >
      <Clock className="h-3 w-3" />
      <span>
        {isVeryUrgent ? "LAATSTE KANS! " : "Vervalt over "}
        {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:
        {String(timeLeft.seconds).padStart(2, "0")}
      </span>
    </div>
  )
}

function generateSocialProofMessage(dealId: number, bookingsToday?: number) {
  const messages = [
    {
      icon: Users,
      text: `Gisteren ${bookingsToday || 47}x geboekt`,
      color:
        "text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-700",
    },
    {
      icon: Eye,
      text: `${Math.floor(Math.random() * 50) + 20} mensen bekijken dit nu`,
      color:
        "text-blue-700 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-700",
    },
    {
      icon: TrendingUp,
      text: `HOT! ${bookingsToday || 23} boekingen vandaag`,
      color: "text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-700",
    },
    {
      icon: Users,
      text: `Populair - ${Math.floor(Math.random() * 30) + 15}x geboekt vandaag`,
      color:
        "text-purple-700 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-700",
    },
    {
      icon: Zap,
      text: "Trending #1 bestemming",
      color:
        "text-orange-700 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300 border border-orange-200 dark:border-orange-700",
    },
  ]

  const messageIndex = dealId % messages.length
  return messages[messageIndex]
}

function getCTAVariant(dealId: number, savings: number, isUrgent: boolean) {
  const variants = [
    { text: "Bekijk Deal", style: "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600" },
    {
      text: `Boek Nu - Bespaar €${savings}`,
      style: "bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600",
    },
    { text: "Exclusieve Deal", style: "bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600" },
    {
      text: isUrgent ? "Laatste Kans!" : "Boek Direct",
      style: "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600",
    },
    {
      text: `€${savings} Korting - Boek Nu`,
      style: "bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600",
    },
  ]

  return variants[dealId % variants.length]
}

interface EnhancedDealCardProps {
  deal: Deal
}

export default function EnhancedDealCard({ deal }: EnhancedDealCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const isUrgent = deal.seatsRemaining <= 3
  const isVeryUrgent = deal.seatsRemaining <= 1
  const savings = deal.originalPrice - deal.currentPrice
  const socialProof = generateSocialProofMessage(deal.id, deal.bookingsToday)
  const ctaVariant = getCTAVariant(deal.id, savings, isUrgent)
  const SocialIcon = socialProof.icon
  const partnerInfo = deal.partner ? AFFILIATE_PARTNERS[deal.partner] : AFFILIATE_PARTNERS.booking

  const competitorSavings = deal.competitorPrice ? deal.competitorPrice - deal.currentPrice : 0

  useEffect(() => {
    trackDealView(deal.id, deal.destination)
  }, [deal.id, deal.destination])

  const handleBookDeal = async () => {
    setIsLoading(true)
    trackDealClick(deal.id, deal.destination, "deal_card")

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const affiliateUrl = generateAffiliateUrl({
      dealId: deal.id,
      destination: deal.destination,
      price: deal.currentPrice,
      airline: deal.airline,
      source: "spotmijnvlucht",
      medium: "deal_card",
      campaign: "flight_deals_2024",
      partner: deal.partner || "booking",
    })

    window.open(affiliateUrl, "_blank")
    setIsLoading(false)
  }

  return (
    <Card className="group overflow-hidden hover:shadow-2xl dark:hover:shadow-2xl dark:hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-3 hover:rotate-1 bg-white dark:bg-gray-800 border-0 shadow-lg relative animate-fadeIn swipe-item touch-friendly">
      <div className="relative">
        <img
          src={deal.image || "/placeholder.svg"}
          alt={`${deal.destination}, ${deal.country}`}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />

        <Badge className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-black px-4 py-2 text-lg shadow-xl border-2 border-white transform rotate-3 group-hover:rotate-6 transition-transform">
          -{deal.discount}%<div className="text-xs font-normal">KORTING</div>
        </Badge>

        {isVeryUrgent && (
          <Badge className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-black px-3 py-2 text-xs animate-bounce-custom border-2 border-white">
            <AlertTriangle className="h-3 w-3 mr-1" />
            LAATSTE PLEK!
          </Badge>
        )}
        {isUrgent && !isVeryUrgent && (
          <Badge className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold px-3 py-2 text-xs animate-pulse-custom border-2 border-white">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Bijna vol!
          </Badge>
        )}

        {/* Airline Logo */}
        <div className="absolute bottom-3 left-3 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md transition-colors duration-300">
          <img src={deal.airlineLogo || "/placeholder.svg"} alt={deal.airline} className="h-6 w-6 object-contain" />
        </div>

        <div className="absolute bottom-3 right-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg border border-gray-200 dark:border-gray-600 transition-colors duration-300">
          <div className="flex items-center gap-1">
            <Shield className="h-3 w-3 text-green-600 dark:text-green-400" />
            <span className="text-xs text-gray-700 dark:text-gray-300 font-semibold">via {partnerInfo.name}</span>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{deal.destination}</h3>
          <span className="text-gray-500 dark:text-gray-400">{deal.country}</span>

          {deal.rating && (
            <div className="flex items-center gap-1 ml-auto">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${i < Math.floor(deal.rating!) ? "text-yellow-400 fill-current" : "text-gray-300 dark:text-gray-600"}`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">({deal.reviewCount || 127})</span>
            </div>
          )}
        </div>

        <div className="mb-4">
          <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700 mb-3 transition-colors duration-300">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Normaal betaal je</div>
                <span className="text-lg text-gray-500 dark:text-gray-400 line-through font-semibold">
                  €{deal.originalPrice}
                </span>
              </div>
              <div className="text-right">
                <div className="text-xs text-green-700 dark:text-green-400 font-bold">JIJ BETAALT</div>
                <span className="text-3xl font-black text-green-600 dark:text-green-400">€{deal.currentPrice}</span>
              </div>
            </div>
            <div className="text-center">
              <span className="bg-green-600 dark:bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                Je bespaart €{savings}!
              </span>
            </div>
          </div>

          {deal.competitorPrice && competitorSavings > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 p-3 rounded-lg mb-3 transition-colors duration-300">
              <div className="flex items-center gap-2 text-sm">
                <Award className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                <span className="text-yellow-800 dark:text-yellow-300 font-semibold">
                  €{competitorSavings} goedkoper dan concurrenten!
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">via {deal.airline}</p>
            <CountdownTimer expiresAt={deal.expiresAt} />
          </div>

          <div className="flex items-center gap-1 text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 px-3 py-2 rounded-lg mb-3 transition-colors duration-300">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-bold">
              {isVeryUrgent ? "LAATSTE PLEK BESCHIKBAAR!" : `Nog maar ${deal.seatsRemaining} plaatsen over!`}
            </span>
          </div>

          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold mb-3 transition-colors duration-300 ${socialProof.color}`}
          >
            <SocialIcon className="h-4 w-4" />
            <span>{socialProof.text}</span>
          </div>

          <div className="flex items-center justify-between mb-4 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg transition-colors duration-300">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                Veilig boeken via {partnerInfo.name}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-semibold">
              <Award className="h-3 w-3" />
              <span>Tot {(partnerInfo.commission * 100).toFixed(1)}% cashback</span>
            </div>
          </div>
        </div>

        <ButtonLoadingState
          onClick={handleBookDeal}
          isLoading={isLoading}
          className={`w-full ${ctaVariant.style} text-white font-black py-3 text-lg group-hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl touch-friendly`}
        >
          {ctaVariant.text}
          <ExternalLink className="h-5 w-5" />
        </ButtonLoadingState>

        <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Shield className="h-3 w-3 text-green-600 dark:text-green-400" />
            <span>SSL Beveiligd</span>
          </div>
          <div className="flex items-center gap-1">
            <Award className="h-3 w-3 text-blue-600 dark:text-blue-400" />
            <span>Gratis annuleren</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 text-yellow-500 dark:text-yellow-400" />
            <span>4.8/5 reviews</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
