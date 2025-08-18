"use client"

import { useState } from "react"
import { Bell, TrendingDown, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import PriceTrackingModal from "./price-tracking-modal"

export default function PriceTrackingSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const features = [
    {
      icon: <TrendingDown className="h-6 w-6" />,
      title: "Automatische Prijsmonitoring",
      description: "We checken dagelijks de prijzen voor jouw favoriete bestemmingen",
    },
    {
      icon: <Bell className="h-6 w-6" />,
      title: "Instant Meldingen",
      description: "Ontvang direct een melding wanneer de prijs daalt onder jouw doelprijs",
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Persoonlijke Alerts",
      description: "Stel meerdere prijsalerts in voor verschillende bestemmingen",
    },
  ]

  return (
    <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-indigo-700">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Mis Nooit Meer Een Goede Deal</h2>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Stel prijsalerts in en ontvang automatisch een melding wanneer vliegtickets naar jouw favoriete bestemming
            in prijs dalen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-4 text-white">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-blue-100 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button
            onClick={() => setIsModalOpen(true)}
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-3 text-lg font-semibold"
          >
            <Bell className="h-5 w-5 mr-2" />
            Prijsalert Instellen
          </Button>
          <p className="text-blue-100 text-sm mt-3">Gratis service • Geen spam • Uitschrijven altijd mogelijk</p>
        </div>
      </div>

      <PriceTrackingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  )
}
